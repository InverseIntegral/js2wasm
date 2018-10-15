import Generator from './generator/generator';
import Parser from './parser/parser';

class Transpiler {

    public static transpile(content: string) {
        const file = Parser.parse(content);
        const module = Generator.generate(file);

        module.optimize();

        return new WebAssembly.Instance(new WebAssembly.Module(module.emitBinary()), {}).exports;
    }

}

export default Transpiler;
