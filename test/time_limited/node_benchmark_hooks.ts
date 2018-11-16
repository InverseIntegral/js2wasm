import {performance} from 'perf_hooks';
import TranspilerHooks from '../../src/transpiler_hooks';

class NodeBenchmarkHooks implements TranspilerHooks {

    private beforeCompilationTime: number;
    private afterExecutionTime: number;

    public getCompleteTime() {
        return this.afterExecutionTime - this.beforeCompilationTime;
    }

    public beforeCompilation() {
        this.beforeCompilationTime = performance.now();
    }

    public afterExecution() {
        this.afterExecutionTime = performance.now();
    }

    public afterCompilation() {}

    public afterExport() {}

    public afterImport() {}

    public beforeExecution() {}

    public beforeExport() {}

    public beforeImport() {}
}

export default NodeBenchmarkHooks;
