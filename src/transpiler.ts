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

        return (...params: any[]) =>  {
            // TODO: Calculate the correct initial size
            const memory = new WebAssembly.Memory({initial: 100});
            const writeableMemory = new Uint32Array(memory.buffer);

            // TODO: Copy other parameters as well
            const firstParameter = params[0];

            if (firstParameter instanceof Array) {
                // TODO: Copy other parameters as well
                writeableMemory[0] = firstParameter[0];
            }

            // TODO: Here we always call the method first, this should be dynamic
            return new WebAssembly.Instance(wasmModule, {
                transpilerImports: {
                    memory,
                },
            }).exports.first(...params);
        };
    }

}

export default Transpiler;
