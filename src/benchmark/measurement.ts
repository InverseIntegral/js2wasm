import Transpiler from '../transpiler';

// noinspection TsLint
type Algorithm = {
    // noinspection TsLint
    func: Function[],
    arguments: any[],
    expectedResult: any
};

class Measurement {

    // noinspection TsLint
    private static executeAlgorithm(algorithm: Function,
                                    args: any[],
                                    expectedResult: number,
                                    rounds: number): number[] {
        const times: number[] = [];

        for (let i = 0; i < rounds; i++) {
            const startTime: number = Date.now();
            const result = algorithm(...args);
            const endTime: number = Date.now();
            times.push(endTime - startTime);

            // noinspection TsLint because of boolean handling in wasm
            if (result != expectedResult) {
                console.log(`Result was wrong, expected=${expectedResult}, actual=${result}`);
            }
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
    public measure(algorithm: Algorithm): [number[], number[]] {
        const func = algorithm.func;
        const args = algorithm.arguments;
        const expectedResult = algorithm.expectedResult;

        Measurement.executeAlgorithm(func[0], args, expectedResult, this.warmupRounds);
        const jsTimes = Measurement.executeAlgorithm(func[0], args, expectedResult, this.measureRounds);

        const wasmArgs = args.slice();
        wasmArgs.unshift(func[0].name);

        const wasmAlgorithm = Transpiler.transpile(func.join(''));
        Measurement.executeAlgorithm(wasmAlgorithm, wasmArgs, expectedResult, this.warmupRounds);
        const wasmTimes = Measurement.executeAlgorithm(wasmAlgorithm, wasmArgs, expectedResult, this.measureRounds);

        return [jsTimes, wasmTimes];
    }
}

export {Measurement, Algorithm};
