import CallWrapper from './call_wrapper';
import {FunctionSignatures, Generator} from './generator/generator';
import {WebAssemblyType} from './generator/wasm_type';
import NullTranspilerHooks from './null_transpiler_hooks';
import Parser from './parser/parser';
import TranspilerHooks from './transpiler_hooks';
import Module = WebAssembly.Module;

class Transpiler {

    private readonly hooks: TranspilerHooks;
    private readonly signatures: FunctionSignatures;

    private wasmModule: Module;

    public constructor(hooks: TranspilerHooks = new NullTranspilerHooks()) {
        this.hooks = hooks;
        this.signatures = new Map();
    }

    public setSignature(name: string, returnType: WebAssemblyType, ...parameterTypes: WebAssemblyType[]) {
        this.signatures.set(name, { returnType, parameterTypes });
        return this;
    }

    public transpile(content: string) {
        this.hooks.beforeCompilation();
        this.compile(content);
        this.hooks.afterCompilation();

        return new CallWrapper(this.wasmModule, this.hooks, this.signatures);
    }

    private compile(content: string) {
        const file = Parser.parse(content);
        const module = Generator.generate(file, this.signatures);

        module.optimize();

        if (!module.validate()) {
            throw new Error('The generated WebAssembly is invalid');
        }

        this.wasmModule = new WebAssembly.Module(module.emitBinary());
        module.dispose();
    }

}

export default Transpiler;
