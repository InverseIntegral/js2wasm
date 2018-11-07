import Transpiler from '../transpiler';
import {MeasurementHook, Measurement} from './measurement_hook';

interface Algorithm {
    // tslint:disable-next-line
    func: Function[];
    arguments: any[];
    expectedResult: any;
}

class Benchmark {

    private static assert(result: any, expected: any) {
        if (typeof result === 'number' && typeof expected === 'boolean') {
            switch (result) {
                case 0:
                    Benchmark.assert(false, expected);
                    break;
                case 1:
                    Benchmark.assert(true, expected);
                    break;
                default:
                    console.error(`Assertion failed, expected=${expected}, actual=${result}`);
                    break;
            }
        } else if (result !== expected) {
            console.error(`Assertion failed, expected=${expected}, actual=${result}`);
        }
    }

    // tslint:disable-next-line
    private static executeJS(algorithm: Function,
                             args: any[],
                             expectedResult: any,
                             rounds: number): Measurement[] {
        const times: Measurement[] = [];

        for (let i = 0; i < rounds; i++) {
            const start = performance.now();
            const result = algorithm(...args);
            const executionTime = performance.now() - start;

            Benchmark.assert(result, expectedResult);

            times.push({
                compilationTime: 0,
                executionTime,
                exportTime: 0,
                importTime: 0,
            });
        }

        return times;
    }

    private measurementHook: MeasurementHook;

    public benchmark(algorithm: Algorithm,
                     warmupRounds: number,
                     measureRounds: number): [Measurement[], Measurement[]] {
        this.measurementHook = new MeasurementHook();
        const transpiler = new Transpiler(this.measurementHook);

        const func = algorithm.func;
        const args = algorithm.arguments;
        const expectedResult = algorithm.expectedResult;

        Benchmark.executeJS(func[0], args, expectedResult, warmupRounds);
        const jsTimes = Benchmark.executeJS(func[0], args, expectedResult, measureRounds);

        const callWrapper = transpiler.transpile(func.join(''));
        const wasmAlgorithm = callWrapper.setCallFunctionName(func[0].name).call.bind(callWrapper);
        this.executeWasm(wasmAlgorithm, args, expectedResult, warmupRounds);
        const wasmTimes = this.executeWasm(wasmAlgorithm, args, expectedResult, measureRounds);

        return [jsTimes, wasmTimes];
    }

    // tslint:disable-next-line
    private executeWasm(algorithm: Function,
                        args: any[],
                        expectedResult: any,
                        rounds: number): Measurement[] {
        const times: Measurement[] = [];

        for (let i = 0; i < rounds; i++) {
            const result = algorithm(...args);
            Benchmark.assert(result, expectedResult);

            times.push(this.measurementHook.getMeasurement());
        }

        return times;
    }
}

export {Benchmark, Algorithm};
