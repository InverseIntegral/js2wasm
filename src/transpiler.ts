import CallWrapper from './call_wrapper';
import {ArrayExpressionVisitor} from './generator/array_expression_visitor';
import {FunctionSignatures, Generator} from './generator/generator';
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

    public transpile(content: string, signatures: FunctionSignatures) {
        this.hooks.beforeCompilation();
        this.compile(content, signatures);
        this.hooks.afterCompilation();

        return new CallWrapper(this.wasmModule, this.hooks, this.arrayLiteralMemorySize, signatures);
    }

    private compile(content: string, signatures: FunctionSignatures) {
        const file = Parser.parse(content);
        const arrayLiteralVisitor = new ArrayExpressionVisitor();
        const module = Generator.generate(file, arrayLiteralVisitor, signatures);
        this.arrayLiteralMemorySize = arrayLiteralVisitor.arrayLiteralMemorySize;

        module.optimize();

        if (!module.validate()) {
            throw new Error('The generated WebAssembly is invalid');
        }

        this.wasmModule = new WebAssembly.Module(module.emitBinary());
        module.dispose();
    }

}

export default Transpiler;
