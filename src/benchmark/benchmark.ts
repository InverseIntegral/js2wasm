import CallWrapper from '../call_wrapper';
import {FunctionSignatures} from '../generator/generator';
import Transpiler from '../transpiler';
import {Measurement, MeasurementHooks} from './measurement_hooks';

interface Algorithm {
    // tslint:disable-next-line
    func: Function[];
    arguments: any[];
    expectedResult: any;
    signatures: FunctionSignatures;
}

class Benchmark {

    private static assert(result: any, expected: any) {
        if (result !== expected) {
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
            const argsDeepCopy = [];

            for (const element of args) {
                if (element instanceof Array) {
                    argsDeepCopy.push(element.slice());
                } else {
                    argsDeepCopy.push(element);
                }
            }

            const start = performance.now();
            const result = algorithm(...argsDeepCopy);
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

    private measurementHooks: MeasurementHooks;

    public benchmark(algorithm: Algorithm,
                     warmupRounds: number,
                     measureRounds: number): [Measurement[], Measurement[]] {
        this.measurementHooks = new MeasurementHooks();
        const transpiler = new Transpiler(this.measurementHooks);

        const func = algorithm.func;
        const args = algorithm.arguments;
        const expectedResult = algorithm.expectedResult;
        const signatures = algorithm.signatures;

        Benchmark.executeJS(func[0], args, expectedResult, warmupRounds);
        const jsTimes = Benchmark.executeJS(func[0], args, expectedResult, measureRounds);

        for (const entity of signatures.entries()) {
            transpiler.setSignature(entity[0], entity[1].returnType, ...entity[1].parameterTypes);
        }

        const callWrapper = transpiler.transpile(func.join(''));
        callWrapper.setFunctionName(func[0].name);
        this.executeWasm(callWrapper, args, expectedResult, warmupRounds);
        const wasmTimes = this.executeWasm(callWrapper, args, expectedResult, measureRounds);

        return [jsTimes, wasmTimes];
    }

    // tslint:disable-next-line
    private executeWasm(callWrapper: CallWrapper,
                        args: any[],
                        expectedResult: any,
                        rounds: number): Measurement[] {
        const times: Measurement[] = [];

        for (let i = 0; i < rounds; i++) {
            const result = callWrapper.call(...args);
            Benchmark.assert(result, expectedResult);

            times.push(this.measurementHooks.getMeasurement());
        }

        return times;
    }
}

export {Benchmark, Algorithm};
