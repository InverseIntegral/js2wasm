import TranspilerHooks from './transpiler_hooks';
import Module = WebAssembly.Module;

class CallWrapper {

    private static fillMemory(parameters: any[], writeableMemory: Uint32Array, initialSize: number) {
        // A copy of the parameters array is needed, to not override the content of the original one
        const fixedParameters = parameters.concat();
        let index = initialSize;

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

    private static readMemory(parameters: any[],
                              outParameters: any[],
                              fixedParameters: any[],
                              readableMemory: Uint32Array) {

        for (const outParameter of outParameters) {
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

    private static calculateInitialMemorySize(parameters: any[], initialMemorySize: number): number {
        const pageSize = Math.pow(2, 16);
        const memoryElementCount = parameters
            .filter((parameter) => parameter instanceof Array)
            .map((array) => array.length + 1)
            .reduce((accumulator, current) => accumulator + current, 0);

        return Math.ceil(((memoryElementCount + initialMemorySize) * 4) / pageSize);
    }

    private readonly hooks: TranspilerHooks;
    private readonly wasmModule: Module;
    private readonly arrayLiteralMemorySize: number;

    private functionName: string;
    private outParameters: any[];

    public constructor(wasmModule: Module, hooks: TranspilerHooks, arrayLiteralMemorySize: number) {
        this.wasmModule = wasmModule;
        this.hooks = hooks;
        this.arrayLiteralMemorySize = arrayLiteralMemorySize;
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
        this.hooks.beforeImport();

        let fixedParameters = parameters;
        let importObject = {};

        const hasArrayParameters = parameters.some((parameter) => parameter instanceof Array);

        if (hasArrayParameters || this.arrayLiteralMemorySize !== 0) {
            const memoryDescriptor = {
                initial: CallWrapper.calculateInitialMemorySize(parameters, this.arrayLiteralMemorySize),
            };

            const memory = new WebAssembly.Memory(memoryDescriptor);
            const writeableMemory = new Uint32Array(memory.buffer);

            fixedParameters = CallWrapper.fillMemory(fixedParameters, writeableMemory, this.arrayLiteralMemorySize);
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

                CallWrapper.readMemory(parameters, this.outParameters, fixedParameters, readableMemory);
            } else {
                throw new Error('Output parameters with no memory dependent parameters');
            }
        }

        this.hooks.afterExport();

        return result;
    }

}

export default CallWrapper;
