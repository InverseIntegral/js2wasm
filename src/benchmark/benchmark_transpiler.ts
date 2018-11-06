import Transpiler from '../transpiler';

interface Measurement {
    compilationTime: number;
    executionTime: number;
    exportTime: number;
    importTime: number;
}

class BenchmarkTranspiler extends Transpiler {

    private beforeCompilationTime: number;
    private measuredCompilationTime: number;

    private beforeExecutionTime: number;
    private measuredExecutionTime: number;

    private beforeExportTime: number;
    private measuredExportTime: number;

    private beforeImportTime: number;
    private measuredImportTime: number;

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
        this.measuredExportTime = performance.now() - this.beforeExportTime;
    }

    protected beforeImport() {
        this.beforeImportTime = performance.now();
    }

    protected afterImport() {
        this.measuredImportTime = performance.now() - this.beforeImportTime;
    }

}

export {BenchmarkTranspiler, Measurement};
