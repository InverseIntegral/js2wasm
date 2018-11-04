import Generator from './generator/generator';
import Parser from './parser/parser';
import Module = WebAssembly.Module;

class Transpiler {

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

    private wasmModule: Module;

    public transpile(content: string) {
        this.beforeCompilation();
        this.compile(content);
        this.afterCompilation();

        return this.callWrapper.bind(this);
    }

    protected beforeCompilation() {}

    protected afterCompilation() {}

    protected beforeImport() {}

    protected afterImport() {}

    protected beforeExecution() {}

    protected afterExecution() {}

    protected beforeExport() {}

    protected afterExport() {}

    private compile(content: string) {
        const file = Parser.parse(content);
        const module = Generator.generate(file);

        module.optimize();

        if (!module.validate()) {
            throw new Error('The generated WebAssembly is invalid');
        }

        this.wasmModule = new WebAssembly.Module(module.emitBinary());
        module.dispose();
    }

    private callWrapper(functionName: string, ...parameters: any[]) {
        this.beforeImport();

        let fixedParameters = parameters;
        let importObject = {};

        const hasArrayParameters = parameters.some((parameter) => parameter instanceof Array);

        if (hasArrayParameters) {
            const memory = new WebAssembly.Memory({ initial: Transpiler.calculateInitialMemorySize(parameters) });
            const writeableMemory = new Uint32Array(memory.buffer);

            fixedParameters = Transpiler.fillMemory(fixedParameters, writeableMemory);
            importObject = { transpilerImports: { memory } };
        }

        this.afterImport();

        this.beforeExecution();
        const instance = new WebAssembly.Instance(this.wasmModule, importObject);
        const result = instance.exports[functionName](...fixedParameters);
        this.afterExecution();

        this.beforeExport();
        if (hasArrayParameters) {
            const exportedMemory = instance.exports.memory;
            const readableMemory = new Uint32Array(exportedMemory.buffer);

            Transpiler.readMemory(parameters, fixedParameters, readableMemory);
        }
        this.afterExport();

        return result;
    }

}

export default Transpiler;
