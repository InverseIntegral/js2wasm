interface TranspilerHooks {
    beforeCompilation(): void;

    afterCompilation(): void;

    beforeExecution(): void;

    afterExecution(): void;

    beforeExport(): void;

    afterExport(): void;

    beforeImport(): void;

    afterImport(): void;
}

class NullTranspilerHooks implements TranspilerHooks {

    public beforeCompilation() {
    }

    public afterCompilation() {
    }

    public beforeExecution() {
    }

    public afterExecution() {
    }

    public beforeExport() {
    }

    public afterExport() {
    }

    public beforeImport() {
    }

    public afterImport() {
    }

}

export {NullTranspilerHooks, TranspilerHooks};
