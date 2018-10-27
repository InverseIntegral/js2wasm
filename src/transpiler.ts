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

        return (functionName: string, ...params: any[]) => {
            let wasmParams = params;
            let importObject = {};

            if (params.some((parameter) => parameter instanceof Array)) {
                const memory = new WebAssembly.Memory({ initial: this.calculateInitialMemorySize(params) });
                const writeableMemory = new Uint32Array(memory.buffer);

                wasmParams = this.fillMemory(wasmParams, writeableMemory);
                importObject = { transpilerImports: { memory } };
            }

            return new WebAssembly.Instance(wasmModule, importObject).exports[functionName](...wasmParams);
        };
    }

    private static fillMemory(params: any[], writeableMemory: Uint32Array) {
        // A copy of the params array is needed, to not override the content of the original one
        const wasmParams = params.concat();
        let index = 0;

        for (let i = 0; i < wasmParams.length; i++) {
            if (wasmParams[i] instanceof Array) {
                const array = wasmParams[i];
                writeableMemory[index++] = array.length;
                wasmParams[i] = index * 4;

                for (const element of array) {
                    writeableMemory[index++] = element;
                }
            }
        }

        return wasmParams;
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
