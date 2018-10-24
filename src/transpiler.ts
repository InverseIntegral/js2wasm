import {Functions, Generator} from './generator/generator';
import Parser from './parser/parser';

class Transpiler {

    public static transpile(content: string, functions: Functions) {
        const file = Parser.parse(content);
        const module = Generator.generate(file, functions);

        module.optimize();

        if (!module.validate()) {
            throw new Error('The generated WebAssembly is invalid');
        }

        return new WebAssembly.Instance(new WebAssembly.Module(module.emitBinary()), {}).exports;
    }

}

export default Transpiler;
