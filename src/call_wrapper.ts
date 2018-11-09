import TranspilerHook from './transpiler_hook';
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

    private static readMemory(parameters: any[], fixedParameters: any[], readableMemory: Uint32Array) {
        let index = 0;

        for (let i = 0; i < parameters.length; i++) {
            if (parameters[i] instanceof Array) {
                const array = parameters[i];

                for (let j = 0; j < array.length; j++) {
                    array[j] = readableMemory[fixedParameters[index] / 4 + j];
                }

                index++;
            }
        }
    }

    private static calculateInitialMemorySize(params: any[]): number {
        const pageSize = Math.pow(2, 16);
        const memoryElementCount = params
            .filter((parameter) => parameter instanceof Array)
            .map((array) => array.length + 1)
            .reduce((accumulator, current) => accumulator + current, 0);

        return Math.ceil((memoryElementCount * 4) / pageSize);
    }

    private readonly hook: TranspilerHook;
    private readonly wasmModule: Module;

    private functionName: string;

    public constructor(wasmModule: Module, hook: TranspilerHook) {
        this.wasmModule = wasmModule;
        this.hook = hook;
    }

    public setFunctionName(functionName: string) {
        this.functionName = functionName;
        return this;
    }

    public call(...parameters: any[]) {
        this.hook.beforeImport();

        let fixedParameters = parameters;
        let importObject = {};

        const hasArrayParameters = parameters.some((parameter) => parameter instanceof Array);

        if (hasArrayParameters) {
            const memory = new WebAssembly.Memory({ initial: CallWrapper.calculateInitialMemorySize(parameters) });
            const writeableMemory = new Uint32Array(memory.buffer);

            fixedParameters = CallWrapper.fillMemory(fixedParameters, writeableMemory);
            importObject = { transpilerImports: { memory } };
        }

        this.hook.afterImport();

        this.hook.beforeExecution();
        const instance = new WebAssembly.Instance(this.wasmModule, importObject);
        const result = instance.exports[this.functionName](...fixedParameters);
        this.hook.afterExecution();

        this.hook.beforeExport();

        if (hasArrayParameters) {
            const exportedMemory = instance.exports.memory;
            const readableMemory = new Uint32Array(exportedMemory.buffer);

            CallWrapper.readMemory(parameters, fixedParameters, readableMemory);
        }

        this.hook.afterExport();

        return result;
    }

}

export default CallWrapper;
