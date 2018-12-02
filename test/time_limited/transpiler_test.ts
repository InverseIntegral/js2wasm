import {expect} from 'chai';
import {fibonacci, fibonacciWhile} from '../../src/benchmark/cases/fibonacci';
import {gcd, gcdWhile} from '../../src/benchmark/cases/gcd';
import {isPrime, isPrimeWhile} from '../../src/benchmark/cases/is_prime';
import {
    mergeSortCopyArrayInteger,
    mergeSortFillInteger,
    mergeSortInteger,
    mergeSortIsSortedInteger,
    mergeSortMergeInteger,
    mergeSortWhileInteger,
} from '../../src/benchmark/cases/mergesort_integer';
import {
    quickSort,
    quickSortFill,
    quickSortIsSorted,
    quickSortPartition,
    quickSortSwap,
    quickSortWhile,
} from '../../src/benchmark/cases/quicksort';
import {sumArray, sumArrayFill, sumArrayFor} from '../../src/benchmark/cases/sum_array';
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
            const content = sumArray.toString() + sumArrayFill.toString() + sumArrayFor.toString();
            const wrapper = transpiler
                .setSignature('sumArray', WebAssemblyType.INT_32, WebAssemblyType.INT_32_ARRAY)
                .setSignature('sumArrayFill', WebAssemblyType.INT_32, WebAssemblyType.INT_32_ARRAY)
                .setSignature('sumArrayFor', WebAssemblyType.INT_32, WebAssemblyType.INT_32_ARRAY)
                .transpile(content);

            expect(wrapper.setFunctionName('sumArrayFor').call(new Array(65535))).to.equal(2147385345);
            expect(hooks.getCompleteTime()).to.be.lessThan(6250);
        });

        it('should run quicksort faster than 6 seconds', () => {
            const content = quickSortSwap.toString() + quickSortPartition.toString() + quickSort.toString() +
                quickSortFill.toString() + quickSortIsSorted.toString() + quickSortWhile.toString();
            const wrapper = transpiler
                .setSignature('quickSortSwap', WebAssemblyType.INT_32, WebAssemblyType.INT_32_ARRAY,
                    WebAssemblyType.INT_32, WebAssemblyType.INT_32)
                .setSignature('quickSortPartition', WebAssemblyType.INT_32, WebAssemblyType.INT_32_ARRAY,
                    WebAssemblyType.INT_32, WebAssemblyType.INT_32)
                .setSignature('quickSort', WebAssemblyType.INT_32_ARRAY, WebAssemblyType.INT_32_ARRAY,
                    WebAssemblyType.INT_32, WebAssemblyType.INT_32)
                .setSignature('quickSortFill', WebAssemblyType.INT_32, WebAssemblyType.INT_32_ARRAY)
                .setSignature('quickSortIsSorted', WebAssemblyType.BOOLEAN, WebAssemblyType.INT_32_ARRAY)
                .setSignature('quickSortWhile', WebAssemblyType.BOOLEAN, WebAssemblyType.INT_32_ARRAY)
                .transpile(content);

            expect(wrapper.setFunctionName('quickSortWhile').call(new Array(1000000))).to.equal(true);
            expect(hooks.getCompleteTime()).to.be.lessThan(6000);
        });

        it('should run mergesort faster than 8.75 seconds', () => {
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
    });
});
