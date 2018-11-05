import Generator from './generator/generator';
import Parser from './parser/parser';
import Module = WebAssembly.Module;

class Transpiler {

    private static fillMemory(parameters: any[], writeableMemory: Uint32Array) {
        // Copy parameters so that the original parameters stay intact
        const fixedParameters = parameters.concat();
        let index = 0;

        for (let i = 0; i < fixedParameters.length; i++) {
            const current = fixedParameters[i];

            if (Transpiler.isArray(current)) {
                writeableMemory[index++] = current.length;
                fixedParameters[i] = index * 4;

                for (const element of current) {
                    writeableMemory[index++] = element;
                }
            } else if (Transpiler.isObject(current)) {
                for (const property in current) {
                    if (current.hasOwnProperty(property)) {
                        writeableMemory[index++] = current[property];
                    }
                }
            }
        }

        return fixedParameters;
    }

    private static calculateInitialMemorySize(parameters: any[]): number {
        const pageSize = Math.pow(2, 16);
        const arrayElements = Transpiler.countArrayElements(parameters);
        const objectProperties = Transpiler.countObjectProperties(parameters);

        return Math.ceil(((arrayElements + objectProperties) * 4) / pageSize);
    }

    private static countArrayElements(parameters: any[]) {
        return parameters.filter(Transpiler.isArray)
            .map((array) => array.length + 1)
            .reduce(Transpiler.sum, 0);
    }

    private static countObjectProperties(parameters: any[]) {
        return parameters.filter((parameter) => Transpiler.isObject(parameter) && !Transpiler.isArray(parameter))
            .map((object) => Object.keys(object).length)
            .reduce(Transpiler.sum, 0);
    }

    private static sum(first: number, second: number) {
        return first + second;
    }

    private static requiresImport(parameter: any) {
        return Transpiler.isArray(parameter) || Transpiler.isObject(parameter);
    }

    private static isArray(parameter: any) {
        return parameter instanceof Array;
    }

    private static isObject(parameter: any) {
        return parameter instanceof Object;
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

        if (parameters.some(Transpiler.requiresImport)) {
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

        return result;
    }

}

export default Transpiler;
