import {performance} from 'perf_hooks';
import Transpiler from '../../src/transpiler';

class NodeBenchmarkTranspiler extends Transpiler {

    private beforeCompilationTime: number;
    private afterExecutionTime: number;

    public getCompleteTime() {
        return this.afterExecutionTime - this.beforeCompilationTime;
    }

    protected beforeCompilation() {
        this.beforeCompilationTime = performance.now();
    }

    protected afterExecution() {
        this.afterExecutionTime = performance.now();
    }
}

export default NodeBenchmarkTranspiler;
