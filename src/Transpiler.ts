import Generator from './generator/Generator';
import Parser from './parser/Parser';

class Transpiler {

    public static transpile(content: string) {
        const tree = Parser.parse(content);
        const module = new Generator().generate(tree);

        module.optimize();

        return new WebAssembly.Instance(new WebAssembly.Module(module.emitBinary()), {}).exports;
    }

}

export default Transpiler;
