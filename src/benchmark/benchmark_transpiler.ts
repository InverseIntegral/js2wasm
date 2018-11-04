import Transpiler from '../transpiler';

interface Measurement {
    compilationTime: number;
    importTime: number;
    executionTime: number;
    exportTime: number;
}

class BenchmarkTranspiler extends Transpiler {

    private beforeCompilationTime: number;
    private measuredCompilationTime: number;

    private beforeImportTime: number;
    private measuredImportTime: number;

    private beforeExecutionTime: number;
    private measuredExecutionTime: number;

    private beforeExportTime: number;
    private measuredExportTime: number;

    public getMeasurement() {
        return {
            compilationTime: this.measuredCompilationTime,
            executionTime: this.measuredExecutionTime,
            exportTime: this.measuredExportTime,
            importTime: this.measuredImportTime,
        };
    }

    protected beforeCompilation() {
        this.beforeCompilationTime = performance.now();
    }

    protected afterCompilation() {
        this.measuredCompilationTime = performance.now() - this.beforeCompilationTime;
    }

    protected beforeImport() {
        this.beforeImportTime = performance.now();
    }

    protected afterImport() {
        this.measuredImportTime = performance.now() - this.beforeImportTime;
    }

    protected beforeExecution() {
        this.beforeExecutionTime = performance.now();
    }

    protected afterExecution() {
        this.measuredExecutionTime = performance.now() - this.beforeExecutionTime;
    }

    protected beforeExport() {
        this.beforeExportTime = performance.now();
    }

    protected afterExport() {
        this.measuredExecutionTime = performance.now() - this.beforeExportTime;
    }
}

export {BenchmarkTranspiler, Measurement};
