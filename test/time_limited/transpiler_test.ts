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
import NodeBenchmarkHook from './node_benchmark_hook';

describe('Transpiler', function() {

    this.timeout(0); // Disable timeouts for all tests in this suite

    let hook: NodeBenchmarkHook;
    let transpiler: Transpiler;

    beforeEach(() => {
        hook = new NodeBenchmarkHook();
        transpiler = new Transpiler(hook);
    });

    describe('#transpile()', () => {
        it('should setCallFunctionName isPrime faster than 7 seconds', () => {
            const exports = transpiler.transpile(isPrime.toString() + isPrimeWhile.toString());

            expect(exports.setFunctionName('isPrimeWhile').call(46327)).to.equal(1);
            expect(hook.getCompleteTime()).to.be.lessThan(7000);
        });

        it('should setCallFunctionName fibonacci faster than 7 seconds', () => {
            const exports = transpiler.transpile(fibonacci.toString() + fibonacciWhile.toString());

            expect(exports.setFunctionName('fibonacciWhile').call(41)).to.equal(165580141);
            expect(hook.getCompleteTime()).to.be.lessThan(7000);
        });

        it('should setCallFunctionName gcd faster than 11 seconds', () => {
            const exports = transpiler.transpile(gcd.toString() + gcdWhile.toString());

            expect(exports.setFunctionName('gcdWhile').call(978, 2147483646)).to.equal(6);
            expect(hook.getCompleteTime()).to.be.lessThan(11000);
        });

        it('should setCallFunctionName sum array faster than 7 seconds', () => {
            const content = sumArray.toString() + sumArrayFill.toString() + sumArrayWhile.toString();
            const exports = transpiler.transpile(content);

            expect(exports.setFunctionName('sumArrayWhile').call(new Array(65535))).to.equal(2147385345);
            expect(hook.getCompleteTime()).to.be.lessThan(7000);
        });

        it('should setCallFunctionName quicksort faster than 12 seconds', () => {
            const content = swap.toString() + partition.toString() + quickSort.toString() + fill.toString() +
                isSorted.toString() + quickSortWhile.toString();
            const exports = transpiler.transpile(content);

            expect(exports.setFunctionName('quickSortWhile').call(new Array(1000000))).to.equal(1);
            expect(hook.getCompleteTime()).to.be.lessThan(12000);
        });

        it('should setCallFunctionName mergesort faster than 16 seconds', () => {
            const content = mergeSortCopyArray.toString() + mergeSort.toString() + mergeSortMerge.toString() +
                mergeSortIsSorted.toString() + mergeSortFill.toString() + mergeSortWhile.toString();
            const exports = transpiler.transpile(content);
            const parameters = [new Array(Math.pow(2, 20)), new Array(Math.pow(2, 20))];

            expect(exports.setFunctionName('mergeSortWhile').call(parameters)).to.equal(1);
            expect(hook.getCompleteTime()).to.be.lessThan(16000);
        });
    });
});
