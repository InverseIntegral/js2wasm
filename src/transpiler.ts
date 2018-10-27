import Generator from './generator/generator';
import Parser from './parser/parser';

class Transpiler {

    public static transpile(content: string) {
        const file = Parser.parse(content);
        const module = Generator.generate(file);

        module.optimize();

        if (!module.validate()) {
            throw new Error('The generated WebAssembly is invalid');
        }

        const wasmModule = new WebAssembly.Module(module.emitBinary());

        return (functionName: string, ...parameters: any[]) => {
            let fixedParameters = parameters;
            let importObject = {};

            if (parameters.some((parameter) => parameter instanceof Array)) {
                const memory = new WebAssembly.Memory({ initial: this.calculateInitialMemorySize(parameters) });
                const writeableMemory = new Uint32Array(memory.buffer);

                fixedParameters = this.fillMemory(fixedParameters, writeableMemory);
                importObject = { transpilerImports: { memory } };
            }

            return new WebAssembly.Instance(wasmModule, importObject).exports[functionName](...fixedParameters);
        };
    }

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

    private static calculateInitialMemorySize(params: any[]): number {
        const pageSize = Math.pow(2, 16);
        const memoryElementCount = params
            .filter((parameter) => parameter instanceof Array)
            .map((array) => array.length + 1)
            .reduce((accumulator, current) => accumulator + current, 0);
        return Math.ceil((memoryElementCount * 4) / pageSize);
    }

}

export default Transpiler;
