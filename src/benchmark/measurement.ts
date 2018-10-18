import Transpiler from '../transpiler';

// noinspection TsLint
type Algorithm = {
    // noinspection TsLint
    func: Function,
    arguments: any[],
};

class Measurement {

    // noinspection TsLint
    private static executeAlgorithm(algorithm: Function, args: any[], rounds: number): number[] {
        const times: number[] = [];

        for (let i = 0; i < rounds; i++) {
            const startTime: number = Date.now();
            algorithm(...args);
            const endTime: number = Date.now();
            times.push(endTime - startTime);
        }

        return times;
    }

    private readonly warmupRounds: number;
    private readonly measureRounds: number;

    constructor(warmupRounds: number, measureRounds: number) {
        this.warmupRounds = warmupRounds;
        this.measureRounds = measureRounds;
    }

    // noinspection TsLint
    public measure(jsAlgorithm: Algorithm): [number[], number[]] {
        const func = jsAlgorithm.func;
        const args = jsAlgorithm.arguments;

        Measurement.executeAlgorithm(func, args, this.warmupRounds);
        const jsTimes = Measurement.executeAlgorithm(func, args, this.measureRounds);

        const wasmAlgorithm = Transpiler.transpile(func.toString())[func.name];
        Measurement.executeAlgorithm(wasmAlgorithm, args, this.warmupRounds);
        const wasmTimes = Measurement.executeAlgorithm(wasmAlgorithm, args, this.measureRounds);

        return [jsTimes, wasmTimes];
    }
}

export {Measurement, Algorithm};
