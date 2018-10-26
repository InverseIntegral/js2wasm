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
            const memory = new WebAssembly.Memory({initial: this.calculateInitialMemorySize(params)});
            const writeableMemory = new Uint32Array(memory.buffer);

            const wasmParams = this.fillMemory(params, writeableMemory);

            return new WebAssembly.Instance(wasmModule, {
                transpilerImports: {
                    memory,
                },
            }).exports[functionName](...wasmParams);
        };
    }

    private static fillMemory(params: any[], writeableMemory: Uint32Array) {
        const wasmParams = params;
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
        const memorySize = params
            .filter((parameter) => parameter instanceof Array)
            .map((array) => array.length + 1)
            .reduce((accumulator, current) => accumulator + current, 0);
        return Math.ceil((memorySize * 4) / pageSize);
    }

}

export default Transpiler;
