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

        return new WebAssembly.Instance(new WebAssembly.Module(module.emitBinary()), {}).exports;
    }

}

export default Transpiler;
