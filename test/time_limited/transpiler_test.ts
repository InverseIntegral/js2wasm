import {expect} from 'chai';
import {fibonacci, fibonacciWhile} from '../../src/benchmark/cases/fibonacci';
import {gcd, gcdWhile} from '../../src/benchmark/cases/gcd';
import {isPrime, isPrimeWhile} from '../../src/benchmark/cases/is_prime';
import {
    mergeSort,
    mergeSortCopyArray, mergeSortFill,
    mergeSortIsSorted,
    mergeSortMerge,
    mergeSortWhile,
} from '../../src/benchmark/cases/mergesort';
import {fill, isSorted, partition, quickSort, quickSortWhile, swap} from '../../src/benchmark/cases/quicksort';
import {sumArray, sumArrayFill, sumArrayWhile} from '../../src/benchmark/cases/sum_array';
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
        it('should run isPrime faster than 7 seconds', () => {
            const wrapper = transpiler.transpile(isPrime.toString() + isPrimeWhile.toString());

            expect(wrapper.setFunctionName('isPrimeWhile').call(46327)).to.equal(1);
            expect(hooks.getCompleteTime()).to.be.lessThan(7000);
        });

        it('should run fibonacci faster than 7 seconds', () => {
            const wrapper = transpiler.transpile(fibonacci.toString() + fibonacciWhile.toString());

            expect(wrapper.setFunctionName('fibonacciWhile').call(41)).to.equal(165580141);
            expect(hooks.getCompleteTime()).to.be.lessThan(7000);
        });

        it('should run gcd faster than 11 seconds', () => {
            const wrapper = transpiler.transpile(gcd.toString() + gcdWhile.toString());

            expect(wrapper.setFunctionName('gcdWhile').call(978, 2147483646)).to.equal(6);
            expect(hooks.getCompleteTime()).to.be.lessThan(11000);
        });

        it('should run sum array faster than 7 seconds', () => {
            const content = sumArray.toString() + sumArrayFill.toString() + sumArrayWhile.toString();
            const wrapper = transpiler.transpile(content);

            expect(wrapper.setFunctionName('sumArrayWhile').call(new Array(65535))).to.equal(2147385345);
            expect(hooks.getCompleteTime()).to.be.lessThan(7000);
        });

        it('should run quicksort faster than 12 seconds', () => {
            const content = swap.toString() + partition.toString() + quickSort.toString() + fill.toString() +
                isSorted.toString() + quickSortWhile.toString();
            const wrapper = transpiler.transpile(content);

            expect(wrapper.setFunctionName('quickSortWhile').call(new Array(1000000))).to.equal(1);
            expect(hooks.getCompleteTime()).to.be.lessThan(12000);
        });

        it('should run mergesort faster than 16 seconds', () => {
            const content = mergeSortCopyArray.toString() + mergeSort.toString() + mergeSortMerge.toString() +
                mergeSortIsSorted.toString() + mergeSortFill.toString() + mergeSortWhile.toString();
            const wrapper = transpiler.transpile(content);
            const parameters = [new Array(Math.pow(2, 20)), new Array(Math.pow(2, 20))];

            expect(wrapper.setFunctionName('mergeSortWhile').call(...parameters)).to.equal(1);
            expect(hooks.getCompleteTime()).to.be.lessThan(16000);
        });
    });
});
