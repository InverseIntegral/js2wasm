import CallWrapper from './call_wrapper';
import Generator from './generator/generator';
import Parser from './parser/parser';
import TranspilerHook from './transpiler_hook';
import Module = WebAssembly.Module;

class Transpiler {

    private readonly hook: TranspilerHook;

    private wasmModule: Module;

    public constructor(hook: TranspilerHook = new TranspilerHook()) {
        this.hook = hook;
    }

    public transpile(content: string) {
        this.hook.beforeCompilation();
        this.compile(content);
        this.hook.afterCompilation();

        return new CallWrapper(this.wasmModule, this.hook);
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
