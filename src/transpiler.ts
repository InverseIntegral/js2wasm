import Generator from './generator/generator';
import Parser from './parser/parser';

class Transpiler {

    public static transpile(content: string) {
        const tree = Parser.parse(content);
        const module = Generator.generate(tree);

        module.optimize();

        return new WebAssembly.Instance(new WebAssembly.Module(module.emitBinary()), {}).exports;
    }

}

export default Transpiler;
