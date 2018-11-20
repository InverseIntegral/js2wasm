import {FunctionSignatures} from './generator/generator';
import {isOfType} from './generator/wasm_type';
import TranspilerHooks from './transpiler_hooks';
import Module = WebAssembly.Module;

class CallWrapper {

    private static fillMemory(parameters: any[], writeableMemory: Uint32Array) {
        // A copy of the parameters array is needed, to not override the content of the original one
        const fixedParameters = parameters.concat();
        let index = 0;

        for (let i = 0; i < fixedParameters.length; i++) {
            if (fixedParameters[i] instanceof Array) {
                const array = fixedParameters[i];
                writeableMemory[index++] = array.length;
                fixedParameters[i] = index * 4;

                for (const element of array) {
                    writeableMemory[index++] = element;
                }
            }
        }

        return fixedParameters;
    }

    private readonly hooks: TranspilerHooks;
    private readonly wasmModule: Module;
    private readonly signatures: FunctionSignatures;

    private functionName: string;
    private outParameters: any[];

    public constructor(wasmModule: Module, hooks: TranspilerHooks, signatures: FunctionSignatures) {
        this.wasmModule = wasmModule;
        this.hooks = hooks;
        this.signatures = signatures;
    }

    public setFunctionName(functionName: string) {
        this.functionName = functionName;
        return this;
    }

    public setOutParameters(...outParameters: any[]) {
        this.outParameters = outParameters;
        return this;
    }

    public call(...parameters: any[]) {
        if (this.functionName === undefined) {
            throw new Error('The function name is not set, did you forget to call setFunctionName?');
        }

        this.hooks.beforeImport();

        const currentSignature = this.getCurrentSignature();
        const expectedLength = currentSignature.parameterTypes.length;
        const actualLength = parameters.length;

        if (actualLength !== expectedLength) {
            throw new Error('The signature of ' + this.functionName +
                ' has ' + expectedLength + ' parameters but ' + actualLength + ' were provided');
        }

        if (!parameters.every((parameter, index) => {
            return isOfType(parameter, currentSignature.parameterTypes[index]);
        })) {
            throw new Error(`At least one parameter of ${this.functionName} did not match its signature type`);
        }

        let fixedParameters = parameters;
        let importObject = {};

        const hasArrayParameters = parameters.some((parameter) => parameter instanceof Array);

        if (hasArrayParameters) {
            const memoryDescriptor = { initial: this.calculateInitialMemorySize(parameters) };

            const memory = new WebAssembly.Memory(memoryDescriptor);
            const writeableMemory = new Uint32Array(memory.buffer);

            fixedParameters = CallWrapper.fillMemory(fixedParameters, writeableMemory);
            importObject = { transpilerImports: { memory } };
        }

        this.hooks.afterImport();

        this.hooks.beforeExecution();
        const instance = new WebAssembly.Instance(this.wasmModule, importObject);
        const result = instance.exports[this.functionName](...fixedParameters);
        this.hooks.afterExecution();

        this.hooks.beforeExport();

        if (this.outParameters !== undefined) {
            if (hasArrayParameters) {
                const exportedMemory = instance.exports.memory;
                const readableMemory = new Uint32Array(exportedMemory.buffer);

                this.readMemory(parameters, fixedParameters, readableMemory);
            } else {
                throw new Error('Output parameters with no memory dependent parameters');
            }
        }

        this.hooks.afterExport();

        return result;
    }

    private readMemory(parameters: any[], fixedParameters: any[], readableMemory: Uint32Array) {
        for (const outParameter of this.outParameters) {
            const outParameterIndex = parameters.indexOf(outParameter);

            if (outParameterIndex === -1) {
                throw new Error('Output parameter not found in call parameter list');
            }

            const outArray = parameters[outParameterIndex];
            const memoryBaseIndex = fixedParameters[outParameterIndex] / 4;

            for (let j = 0; j < outArray.length; j++) {
                outArray[j] = readableMemory[memoryBaseIndex + j];
            }
        }
    }

    private calculateInitialMemorySize(parameters: any[]): number {
        const pageSize = Math.pow(2, 16);
        const memoryElementCount = parameters
            .filter((parameter) => parameter instanceof Array)
            .map((array) => array.length + 1)
            .reduce((accumulator, current) => accumulator + current, 0);

        return Math.ceil((memoryElementCount * 4) / pageSize);
    }

    private getCurrentSignature() {
        const signature = this.signatures.get(this.functionName);

        if (signature === undefined) {
            throw new Error(`Undefined signature for function ${this.functionName}`);
        }

        return signature;
    }

}

export default CallWrapper;
