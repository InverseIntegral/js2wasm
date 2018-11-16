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

export default TranspilerHooks;
