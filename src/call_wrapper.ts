import {FunctionSignature, FunctionSignatures} from './generator/generator';
import {isOfType, WebAssemblyType} from './generator/wasm_type';
import TranspilerHooks from './transpiler_hooks';
import Module = WebAssembly.Module;

class CallWrapper {

    private static INT_32_OFFSET = 4;
    private static FLOAT_64_OFFSET = 8;

    private static fillMemory(memoryLayout: Map<number, number>, memory: WebAssembly.Memory) {
        const i32Memory = new Uint32Array(memory.buffer);
        const f64Memory = new Float64Array(memory.buffer);

        for (const entry of memoryLayout.entries()) {
            const key = entry[0];
            const value = entry[1];

            if (isOfType(value, WebAssemblyType.INT_32)) {
                i32Memory[key  / CallWrapper.INT_32_OFFSET] = value;
            } else if (isOfType(value, WebAssemblyType.FLOAT_64)) {
                f64Memory[key / CallWrapper.FLOAT_64_OFFSET] = value;
            }
        }
    }

    private static getMemoryLayout(parameters: any[], signature: FunctionSignature): [Map<number, number>, any[]] {
        const fixedParameters = parameters.concat();
        const memory = new Map<number, number>();

        let wasmMemoryIndex = 0;

        for (let i = 0; i < parameters.length; i++) {
            const current = parameters[i];
            const type = signature.parameterTypes[i];

            if (type === WebAssemblyType.INT_32_ARRAY) {
                memory.set(wasmMemoryIndex, current.length);
                wasmMemoryIndex += CallWrapper.INT_32_OFFSET;

                fixedParameters[i] = wasmMemoryIndex;

                for (const element of current) {
                    memory.set(wasmMemoryIndex, element);
                    wasmMemoryIndex += CallWrapper.INT_32_OFFSET;
                }
            } else if (type === WebAssemblyType.FLOAT_64_ARRAY) {
                if (wasmMemoryIndex % CallWrapper.FLOAT_64_OFFSET !== 0) {
                    wasmMemoryIndex += (CallWrapper.FLOAT_64_OFFSET - (wasmMemoryIndex % CallWrapper.FLOAT_64_OFFSET));
                }

                memory.set(wasmMemoryIndex, current.length);
                wasmMemoryIndex += CallWrapper.FLOAT_64_OFFSET;

                fixedParameters[i] = wasmMemoryIndex;

                for (const element of current) {
                    memory.set(wasmMemoryIndex, element);
                    wasmMemoryIndex += CallWrapper.FLOAT_64_OFFSET;
                }
            }
        }

        return [memory, fixedParameters];
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

            const tuple = CallWrapper.getMemoryLayout(parameters, currentSignature);

            const memoryLayout = tuple[0];
            fixedParameters = tuple[1];

            let maxKey = [...memoryLayout.keys()].reduce((a, b) => Math.max(a, b));

            if (isOfType(memoryLayout.get(maxKey), WebAssemblyType.INT_32)) {
                maxKey += CallWrapper.INT_32_OFFSET;
            } else {
                maxKey += CallWrapper.FLOAT_64_OFFSET;
            }

            const memory = new WebAssembly.Memory({
                initial: Math.ceil(maxKey / Math.pow(2, 16)),
            });

            CallWrapper.fillMemory(memoryLayout, memory);
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

                this.readMemory(parameters, fixedParameters, exportedMemory, currentSignature);
            } else {
                throw new Error('Output parameters with no memory dependent parameters');
            }
        }

        this.hooks.afterExport();

        return this.convertResult(result, currentSignature);
    }

    private convertResult(result: number, signature: FunctionSignature) {
        if (signature.returnType === WebAssemblyType.BOOLEAN) {
            if (result !== 0 && result !== 1) {
                throw new Error(`The returned value of the function ${this.functionName}
                    could not be converted to boolean`);
            }

            return result !== 0;
        }

        return result;
    }

    private readMemory(parameters: any[],
                       fixedParameters: any[],
                       memory: WebAssembly.Memory,
                       signature: FunctionSignature) {

        const i32Memory = new Uint32Array(memory.buffer);
        const f64Memory = new Float64Array(memory.buffer);

        for (const outParameter of this.outParameters) {
            if (!parameters.includes(outParameter)) {
                throw new Error('Output parameter not found in call parameter list');
            }

            const index = parameters.indexOf(outParameter);

            const outArray = parameters[index];
            const baseAddress = fixedParameters[index];
            const type = signature.parameterTypes[index];

            for (let j = 0; j < outArray.length; j++) {
                if (type === WebAssemblyType.INT_32_ARRAY) {
                    outArray[j] = i32Memory[baseAddress / CallWrapper.INT_32_OFFSET + j];
                } else if (type === WebAssemblyType.FLOAT_64_ARRAY) {
                    outArray[j] = f64Memory[baseAddress / CallWrapper.FLOAT_64_OFFSET + j];
                } else {
                    throw new Error(`Tried to export unknown type ${WebAssemblyType[type]}`);
                }
            }
        }
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
