import TranspilerHooks from '../transpiler_hooks';

interface Measurement {
    compilationTime: number;
    executionTime: number;
    exportTime: number;
    importTime: number;
}

class MeasurementHooks implements TranspilerHooks {

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

    public beforeCompilation() {
        this.beforeCompilationTime = performance.now();
    }

    public afterCompilation() {
        this.measuredCompilationTime = performance.now() - this.beforeCompilationTime;
    }

    public beforeExecution() {
        this.beforeExecutionTime = performance.now();
    }

    public afterExecution() {
        this.measuredExecutionTime = performance.now() - this.beforeExecutionTime;
    }

    public beforeExport() {
        this.beforeExportTime = performance.now();
    }

    public afterExport() {
        this.measuredExportTime = performance.now() - this.beforeExportTime;
    }

    public beforeImport() {
        this.beforeImportTime = performance.now();
    }

    public afterImport() {
        this.measuredImportTime = performance.now() - this.beforeImportTime;
    }

}

export {MeasurementHooks, Measurement};
