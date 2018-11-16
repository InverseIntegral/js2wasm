import CallWrapper from './call_wrapper';
import {Functions, Generator} from './generator/generator';
import NullTranspilerHooks from './null_transpiler_hooks';
import Parser from './parser/parser';
import TranspilerHooks from './transpiler_hooks';
import Module = WebAssembly.Module;

class Transpiler {

    private readonly hooks: TranspilerHooks;

    private wasmModule: Module;

    public constructor(hooks: TranspilerHooks = new NullTranspilerHooks()) {
        this.hooks = hooks;
    }

    public transpile(content: string, functions: Functions) {
        this.hooks.beforeCompilation();
        this.compile(content, functions);
        this.hooks.afterCompilation();

        return new CallWrapper(this.wasmModule, this.hooks);
    }

    private compile(content: string, functions: Functions) {
        const file = Parser.parse(content);
        const module = Generator.generate(file, functions);

        module.optimize();

        if (!module.validate()) {
            throw new Error('The generated WebAssembly is invalid');
        }

        this.wasmModule = new WebAssembly.Module(module.emitBinary());
        module.dispose();
    }

}

export default Transpiler;
