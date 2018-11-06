import {performance} from 'perf_hooks';
import TranspilerHook from '../../src/transpiler_hook';

class NodeBenchmarkTranspiler extends TranspilerHook {

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

export default NodeBenchmarkTranspiler;
