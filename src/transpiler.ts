import CallWrapper from './call_wrapper';
import Generator from './generator/generator';
import Parser from './parser/parser';
import TranspilerHooks from './transpiler_hooks';
import Module = WebAssembly.Module;

class Transpiler {

    private readonly hooks: TranspilerHooks;

    private wasmModule: Module;

    public constructor(hooks: TranspilerHooks = new TranspilerHooks()) {
        this.hooks = hooks;
    }

    public transpile(content: string) {
        this.hooks.beforeCompilation();
        this.compile(content);
        this.hooks.afterCompilation();

        return new CallWrapper(this.wasmModule, this.hooks);
    }

    private compile(content: string) {
        const file = Parser.parse(content);
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
