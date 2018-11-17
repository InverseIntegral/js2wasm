import CallWrapper from './call_wrapper';
import {ArrayLiteralVisitor} from './generator/array_literal_visitor';
import Generator from './generator/generator';
import NullTranspilerHooks from './null_transpiler_hooks';
import Parser from './parser/parser';
import TranspilerHooks from './transpiler_hooks';
import Module = WebAssembly.Module;

class Transpiler {

    private readonly hooks: TranspilerHooks;

    private wasmModule: Module;
    private arrayLiteralMemorySize = 0;

    public constructor(hooks: TranspilerHooks = new NullTranspilerHooks()) {
        this.hooks = hooks;
    }

    public transpile(content: string) {
        this.hooks.beforeCompilation();
        this.compile(content);
        this.hooks.afterCompilation();

        return new CallWrapper(this.wasmModule, this.hooks, this.arrayLiteralMemorySize);
    }

    private compile(content: string) {
        const file = Parser.parse(content);
        this.arrayLiteralMemorySize = new ArrayLiteralVisitor().run(file);
        const module = Generator.generate(file);

        module.optimize();

        if (!module.validate()) {
            throw new Error('The generated WebAssembly is invalid');
        }

        this.wasmModule = new WebAssembly.Module(module.emitBinary());
        module.dispose();
    }

}

export default Transpiler;
