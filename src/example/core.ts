import {Expression, FunctionType, i32, Module, Statement} from 'binaryen';

class Core {

    private readonly unoptimizedEmitText: string;
    private readonly optimizedEmitText: string;
    private readonly binary: Uint8Array;

    public constructor() {
        const binaryenModule = this.createModule();
        this.unoptimizedEmitText = binaryenModule.emitText();
        binaryenModule.optimize();
        this.optimizedEmitText = binaryenModule.emitText();
        this.binary = binaryenModule.emitBinary();
        binaryenModule.dispose();
    }

    private createModule(): Module {
        const binaryenModule: Module = new Module();

        const functionType: FunctionType = binaryenModule.addFunctionType('adderType', i32, [i32, i32]);

        const left: Expression = binaryenModule.getLocal(0, i32);
        const right: Expression = binaryenModule.getLocal(1, i32);
        const add: Expression = binaryenModule.i32.add(left, right);
        const result: Statement = binaryenModule.return(add);

        binaryenModule.addFunction('add', functionType, [], result);

        binaryenModule.addFunctionExport('add', 'add');

        return binaryenModule;
    }

    public get unoptEmitText(): string {
        return this.unoptimizedEmitText;
    }

    public get optEmitText(): string {
        return this.optimizedEmitText;
    }

    public get binaryArray(): Uint8Array {
        return this.binary;
    }

}

export default Core;
