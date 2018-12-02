import {expect} from 'chai';
import {fibonacci, fibonacciWhile} from '../../src/benchmark/cases/fibonacci';
import {gcd, gcdWhile} from '../../src/benchmark/cases/gcd';
import {isPrime, isPrimeWhile} from '../../src/benchmark/cases/is_prime';
import {
    mergeSortCopyArrayDouble,
    mergeSortDouble,
    mergeSortFillDouble,
    mergeSortIsSortedDouble,
    mergeSortMergeDouble,
    mergeSortWhileDouble,
} from '../../src/benchmark/cases/mergesort_double';
import {
    mergeSortCopyArrayInteger,
    mergeSortFillInteger,
    mergeSortInteger,
    mergeSortIsSortedInteger,
    mergeSortMergeInteger,
    mergeSortWhileInteger,
} from '../../src/benchmark/cases/mergesort_integer';
import {
    quickSortDouble,
    quickSortFillDouble,
    quickSortIsSortedDouble,
    quickSortPartitionDouble,
    quickSortSwapDouble,
    quickSortWhileDouble,
} from '../../src/benchmark/cases/quicksort_double';
import {
    quickSortFillInteger,
    quickSortInteger,
    quickSortIsSortedInteger,
    quickSortPartitionInteger,
    quickSortSwapInteger,
    quickSortWhileInteger,
} from '../../src/benchmark/cases/quicksort_integer';
import {sumArrayFillInteger, sumArrayForInteger, sumArrayInteger} from '../../src/benchmark/cases/sum_array_integer';
import {WebAssemblyType} from '../../src/generator/wasm_type';
import Transpiler from '../../src/transpiler';
import NodeBenchmarkHooks from './node_benchmark_hooks';

describe('Transpiler', function() {

    this.timeout(0); // Disable timeouts for all tests in this suite

    let hooks: NodeBenchmarkHooks;
    let transpiler: Transpiler;

    beforeEach(() => {
        hooks = new NodeBenchmarkHooks();
        transpiler = new Transpiler(hooks);
    });

    describe('#transpile()', () => {
        it('should run isPrime faster than 6 seconds', () => {
            const wrapper = transpiler
                .setSignature('isPrime', WebAssemblyType.BOOLEAN, WebAssemblyType.INT_32)
                .setSignature('isPrimeWhile', WebAssemblyType.BOOLEAN, WebAssemblyType.INT_32)
                .transpile(isPrime.toString() + isPrimeWhile.toString());

            expect(wrapper.setFunctionName('isPrimeWhile').call(46327)).to.equal(true);
            expect(hooks.getCompleteTime()).to.be.lessThan(6000);
        });

        it('should run fibonacci faster than 7 seconds', () => {
            const wrapper = transpiler
                .setSignature('fibonacci', WebAssemblyType.INT_32, WebAssemblyType.INT_32)
                .setSignature('fibonacciWhile', WebAssemblyType.INT_32, WebAssemblyType.INT_32)
                .transpile(fibonacci.toString() + fibonacciWhile.toString());

            expect(wrapper.setFunctionName('fibonacciWhile').call(41)).to.equal(165580141);
            expect(hooks.getCompleteTime()).to.be.lessThan(7000);
        });

        it('should run gcd faster than 11 seconds', () => {
            const wrapper = transpiler
                .setSignature('gcd', WebAssemblyType.INT_32, WebAssemblyType.INT_32, WebAssemblyType.INT_32)
                .setSignature('gcdWhile', WebAssemblyType.INT_32, WebAssemblyType.INT_32, WebAssemblyType.INT_32)
                .transpile(gcd.toString() + gcdWhile.toString());

            expect(wrapper.setFunctionName('gcdWhile').call(978, 2147483646)).to.equal(6);
            expect(hooks.getCompleteTime()).to.be.lessThan(11000);
        });

        it('should run sum array faster than 6.25 seconds', () => {
            const content = sumArrayInteger.toString() + sumArrayFillInteger.toString() + sumArrayForInteger.toString();
            const wrapper = transpiler
                .setSignature('sumArrayInteger', WebAssemblyType.INT_32, WebAssemblyType.INT_32_ARRAY)
                .setSignature('sumArrayFillInteger', WebAssemblyType.INT_32, WebAssemblyType.INT_32_ARRAY)
                .setSignature('sumArrayForInteger', WebAssemblyType.INT_32, WebAssemblyType.INT_32_ARRAY)
                .transpile(content);

            expect(wrapper.setFunctionName('sumArrayForInteger').call(new Array(65535))).to.equal(2147385345);
            expect(hooks.getCompleteTime()).to.be.lessThan(6250);
        });

        it('should run integer quicksort faster than 6 seconds', () => {
            const content = quickSortSwapInteger.toString() + quickSortPartitionInteger.toString() +
                quickSortInteger.toString() + quickSortFillInteger.toString() +
                quickSortIsSortedInteger.toString() + quickSortWhileInteger.toString();
            const wrapper = transpiler
                .setSignature('quickSortSwapInteger', WebAssemblyType.INT_32, WebAssemblyType.INT_32_ARRAY,
                    WebAssemblyType.INT_32, WebAssemblyType.INT_32)
                .setSignature('quickSortPartitionInteger', WebAssemblyType.INT_32, WebAssemblyType.INT_32_ARRAY,
                    WebAssemblyType.INT_32, WebAssemblyType.INT_32)
                .setSignature('quickSortInteger', WebAssemblyType.INT_32_ARRAY, WebAssemblyType.INT_32_ARRAY,
                    WebAssemblyType.INT_32, WebAssemblyType.INT_32)
                .setSignature('quickSortFillInteger', WebAssemblyType.INT_32, WebAssemblyType.INT_32_ARRAY)
                .setSignature('quickSortIsSortedInteger', WebAssemblyType.BOOLEAN, WebAssemblyType.INT_32_ARRAY)
                .setSignature('quickSortWhileInteger', WebAssemblyType.BOOLEAN, WebAssemblyType.INT_32_ARRAY)
                .transpile(content);

            expect(wrapper.setFunctionName('quickSortWhileInteger').call(new Array(1000000))).to.equal(true);
            expect(hooks.getCompleteTime()).to.be.lessThan(6000);
        });

        it('should run double quicksort faster than 6.5 seconds', () => {
            const content = quickSortSwapDouble.toString() + quickSortPartitionDouble.toString() +
                quickSortDouble.toString() + quickSortFillDouble.toString() +
                quickSortIsSortedDouble.toString() + quickSortWhileDouble.toString();
            const wrapper = transpiler
                .setSignature('quickSortSwapDouble', WebAssemblyType.INT_32, WebAssemblyType.FLOAT_64_ARRAY,
                    WebAssemblyType.INT_32, WebAssemblyType.INT_32)
                .setSignature('quickSortPartitionDouble', WebAssemblyType.INT_32, WebAssemblyType.FLOAT_64_ARRAY,
                    WebAssemblyType.INT_32, WebAssemblyType.INT_32)
                .setSignature('quickSortDouble', WebAssemblyType.FLOAT_64_ARRAY, WebAssemblyType.FLOAT_64_ARRAY,
                    WebAssemblyType.INT_32, WebAssemblyType.INT_32)
                .setSignature('quickSortFillDouble', WebAssemblyType.INT_32, WebAssemblyType.FLOAT_64_ARRAY)
                .setSignature('quickSortIsSortedDouble', WebAssemblyType.BOOLEAN, WebAssemblyType.FLOAT_64_ARRAY)
                .setSignature('quickSortWhileDouble', WebAssemblyType.BOOLEAN, WebAssemblyType.FLOAT_64_ARRAY)
                .transpile(content);

            expect(wrapper.setFunctionName('quickSortWhileDouble').call(new Array(1000000))).to.equal(true);
            expect(hooks.getCompleteTime()).to.be.lessThan(6500);
        });

        it('should run integer mergesort faster than 8.75 seconds', () => {
            const content = mergeSortCopyArrayInteger.toString() + mergeSortInteger.toString() +
                mergeSortMergeInteger.toString() + mergeSortIsSortedInteger.toString() +
                mergeSortFillInteger.toString() + mergeSortWhileInteger.toString();
            const wrapper = transpiler
                .setSignature('mergeSortCopyArrayInteger', WebAssemblyType.INT_32_ARRAY, WebAssemblyType.INT_32_ARRAY,
                    WebAssemblyType.INT_32_ARRAY, WebAssemblyType.INT_32, WebAssemblyType.INT_32)
                .setSignature('mergeSortInteger', WebAssemblyType.INT_32_ARRAY, WebAssemblyType.INT_32_ARRAY,
                    WebAssemblyType.INT_32_ARRAY, WebAssemblyType.INT_32, WebAssemblyType.INT_32)
                .setSignature('mergeSortMergeInteger', WebAssemblyType.INT_32_ARRAY, WebAssemblyType.INT_32_ARRAY,
                    WebAssemblyType.INT_32_ARRAY, WebAssemblyType.INT_32, WebAssemblyType.INT_32,
                    WebAssemblyType.INT_32)
                .setSignature('mergeSortIsSortedInteger', WebAssemblyType.BOOLEAN, WebAssemblyType.INT_32_ARRAY)
                .setSignature('mergeSortFillInteger', WebAssemblyType.INT_32, WebAssemblyType.INT_32_ARRAY)
                .setSignature('mergeSortWhileInteger', WebAssemblyType.BOOLEAN, WebAssemblyType.INT_32_ARRAY,
                    WebAssemblyType.INT_32_ARRAY)
                .transpile(content);
            const parameters = [new Array(Math.pow(2, 20)), new Array(Math.pow(2, 20))];

            expect(wrapper.setFunctionName('mergeSortWhileInteger').call(...parameters)).to.equal(true);
            expect(hooks.getCompleteTime()).to.be.lessThan(8750);
        });

        it('should run double mergesort faster than 9 seconds', () => {
            const content = mergeSortCopyArrayDouble.toString() + mergeSortDouble.toString() +
                mergeSortMergeDouble.toString() + mergeSortIsSortedDouble.toString() +
                mergeSortFillDouble.toString() + mergeSortWhileDouble.toString();
            const wrapper = transpiler
                .setSignature('mergeSortCopyArrayDouble', WebAssemblyType.FLOAT_64_ARRAY,
                    WebAssemblyType.FLOAT_64_ARRAY, WebAssemblyType.FLOAT_64_ARRAY,
                    WebAssemblyType.INT_32, WebAssemblyType.INT_32)
                .setSignature('mergeSortDouble', WebAssemblyType.FLOAT_64_ARRAY, WebAssemblyType.FLOAT_64_ARRAY,
                    WebAssemblyType.FLOAT_64_ARRAY, WebAssemblyType.INT_32, WebAssemblyType.INT_32)
                .setSignature('mergeSortMergeDouble', WebAssemblyType.FLOAT_64_ARRAY, WebAssemblyType.FLOAT_64_ARRAY,
                    WebAssemblyType.FLOAT_64_ARRAY, WebAssemblyType.INT_32, WebAssemblyType.INT_32,
                    WebAssemblyType.INT_32)
                .setSignature('mergeSortIsSortedDouble', WebAssemblyType.BOOLEAN, WebAssemblyType.FLOAT_64_ARRAY)
                .setSignature('mergeSortFillDouble', WebAssemblyType.INT_32, WebAssemblyType.FLOAT_64_ARRAY)
                .setSignature('mergeSortWhileDouble', WebAssemblyType.BOOLEAN, WebAssemblyType.FLOAT_64_ARRAY,
                    WebAssemblyType.FLOAT_64_ARRAY)
                .transpile(content);
            const parameters = [new Array(Math.pow(2, 20)), new Array(Math.pow(2, 20))];

            expect(wrapper.setFunctionName('mergeSortWhileDouble').call(...parameters)).to.equal(true);
            expect(hooks.getCompleteTime()).to.be.lessThan(9000);
        });
    });
});
