import {performance} from 'perf_hooks';
import TranspilerHooks from '../../src/transpiler_hooks';

class NodeBenchmarkHooks extends TranspilerHooks {

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
}

export default NodeBenchmarkHooks;
