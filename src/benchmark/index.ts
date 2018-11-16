import {WebAssemblyType} from '../generator/wasm_type';
import {Algorithm, Benchmark} from './benchmark';
import {fibonacci, fibonacciWhile} from './cases/fibonacci';
import {gcd, gcdWhile} from './cases/gcd';
import {isPrime, isPrimeWhile} from './cases/is_prime';
import {
    mergeSort,
    mergeSortCopyArray,
    mergeSortFill,
    mergeSortIsSorted,
    mergeSortMerge,
    mergeSortWhile,
} from './cases/mergesort';
import {newtonsMethod, newtonsMethodWhile} from './cases/newtons_method';
import {
    quickSort,
    quickSortFill,
    quickSortIsSorted,
    quickSortPartition,
    quickSortSwap,
    quickSortWhile,
} from './cases/quicksort';
import {sumArray, sumArrayFill, sumArrayFor} from './cases/sum_array';
import {sumIntegers, sumIntegersWhile} from './cases/sum_integers';
import {Measurement} from './measurement_hooks';

const fibonacciFunc = {
    arguments: [41],
    expectedResult: 165580141,
    func: [fibonacciWhile, fibonacci],
    types: new Map([
        ['fibonacci', [WebAssemblyType.INT_32]],
        ['fibonacciWhile', [WebAssemblyType.INT_32]],
    ]),
};

const gcdFunc = {
    arguments: [978, 2147483646],
    expectedResult: 6,
    func: [gcdWhile, gcd],
    types: new Map([
        ['gcd', [WebAssemblyType.INT_32, WebAssemblyType.INT_32]],
        ['gcdWhile', [WebAssemblyType.INT_32, WebAssemblyType.INT_32]],
    ]),
};

const sumArrayFunc = {
    arguments: [new Array(65535)],
    expectedResult: 2147385345,
    func: [sumArrayFor, sumArrayFill, sumArray],
    types: new Map([
        ['sumArray', [WebAssemblyType.INT_32_ARRAY]],
        ['sumArrayFill', [WebAssemblyType.INT_32_ARRAY]],
        ['sumArrayFor', [WebAssemblyType.INT_32_ARRAY]],
    ]),
};

const sumIntegersFunc = {
    arguments: [],
    expectedResult: 2147385345,
    func: [sumIntegersWhile, sumIntegers],
    types: new Map([
        ['sumIntegers', []],
        ['sumIntegersWhile', []],
    ]),
};

const isPrimeFunc = {
    arguments: [46327],
    expectedResult: true,
    func: [isPrimeWhile, isPrime],
    types: new Map([
        ['isPrime', [WebAssemblyType.INT_32]],
        ['isPrimeWhile', [WebAssemblyType.INT_32]],
    ]),
};

const newtonsMethodFunc = {
    arguments: [200, 32],
    expectedResult: 24,
    func: [newtonsMethodWhile, newtonsMethod],
    types: new Map([
        ['newtonsMethod', [WebAssemblyType.INT_32, WebAssemblyType.INT_32]],
        ['newtonsMethodWhile', [WebAssemblyType.INT_32, WebAssemblyType.INT_32]],
    ]),
};

const mergeSortFunc = {
    arguments: [new Array(Math.pow(2, 20)), new Array(Math.pow(2, 20))],
    expectedResult: true,
    func: [mergeSortWhile, mergeSortCopyArray, mergeSortFill, mergeSortIsSorted, mergeSortMerge, mergeSort],
    types: new Map([
        ['mergeSortCopyArray', [WebAssemblyType.INT_32_ARRAY,
            WebAssemblyType.INT_32_ARRAY,
            WebAssemblyType.INT_32,
            WebAssemblyType.INT_32]],
        ['mergeSort', [WebAssemblyType.INT_32_ARRAY,
            WebAssemblyType.INT_32_ARRAY,
            WebAssemblyType.INT_32,
            WebAssemblyType.INT_32]],
        ['mergeSortMerge', [WebAssemblyType.INT_32_ARRAY,
            WebAssemblyType.INT_32_ARRAY,
            WebAssemblyType.INT_32,
            WebAssemblyType.INT_32,
            WebAssemblyType.INT_32]],
        ['mergeSortIsSorted', [WebAssemblyType.INT_32_ARRAY]],
        ['mergeSortFill', [WebAssemblyType.INT_32_ARRAY]],
        ['mergeSortWhile', [WebAssemblyType.INT_32_ARRAY, WebAssemblyType.INT_32_ARRAY]],
    ]),
};

const quicksortFunc = {
    arguments: [new Array(1000000)],
    expectedResult: true,
    func: [quickSortWhile, quickSortIsSorted, quickSortFill, quickSort, quickSortPartition, quickSortSwap],
    types: new Map([
        ['quickSortSwap', [WebAssemblyType.INT_32_ARRAY, WebAssemblyType.INT_32, WebAssemblyType.INT_32]],
        ['quickSortPartition', [WebAssemblyType.INT_32_ARRAY,
            WebAssemblyType.INT_32,
            WebAssemblyType.INT_32]],
        ['quickSort', [WebAssemblyType.INT_32_ARRAY, WebAssemblyType.INT_32, WebAssemblyType.INT_32]],
        ['quickSortFill', [WebAssemblyType.INT_32_ARRAY]],
        ['quickSortIsSorted', [WebAssemblyType.INT_32_ARRAY]],
        ['quickSortWhile', [WebAssemblyType.INT_32]],
    ]),
};

const algorithms = new Map<string, Algorithm>([
    ['Fibonacci', fibonacciFunc],
    ['Sum Array', sumArrayFunc],
    ['Sum Integers', sumIntegersFunc],
    ['isPrime', isPrimeFunc],
    ['Newtons Method', newtonsMethodFunc],
    ['gcd', gcdFunc],
    ['Quicksort', quicksortFunc],
    ['Mergesort', mergeSortFunc],
]);

function sum(value1: number, value2: number): number {
    return value1 + value2;
}

function mean(values: number[]): number {
    return values.reduce(sum, 0) / values.length;
}

function variance(values: number[]): number {
    const meanValue = mean(values);
    return mean(values.map((n) => Math.pow(n - meanValue, 2)));
}

function extractCompilationTime(measurement: Measurement): number {
    return measurement.compilationTime;
}

function extractExecutionTime(measurement: Measurement): number {
    return measurement.executionTime;
}

function extractExportTime(measurement: Measurement) {
    return measurement.exportTime;
}

function extractImportTime(measurement: Measurement) {
    return measurement.importTime;
}

function extractTotalTime(measurement: Measurement) {
    return extractCompilationTime(measurement)
        + extractExecutionTime(measurement)
        + extractExportTime(measurement)
        + extractImportTime(measurement);
}

function logResult(result: [Measurement[], Measurement[]]) {
    const jsTimes = result[0];
    const wasmTimes = result[1];

    const jsMean = mean(jsTimes.map(extractExecutionTime));
    const jsVariance = variance(jsTimes.map(extractExecutionTime));

    const wasmCompilationMean = mean(wasmTimes.map(extractCompilationTime));
    const wasmExecutionMean = mean(wasmTimes.map(extractExecutionTime));
    const wasmExportMean = mean(wasmTimes.map(extractExportTime));
    const wasmImportMean = mean(wasmTimes.map(extractImportTime));

    const wasmMean = mean(wasmTimes.map(extractTotalTime));
    const wasmVariance = variance(wasmTimes.map(extractTotalTime));

    // tslint:disable-next-line
    console.log([
        jsMean,
        wasmMean,
        jsVariance,
        wasmVariance,
    ].toString(), [
        wasmCompilationMean,
        wasmImportMean,
        wasmExecutionMean,
        wasmExportMean,
    ].toString());
}

function createSelection(selectionElement: HTMLSelectElement) {
    for (const algorithm of algorithms.keys()) {
        const option: HTMLOptionElement = document.createElement('option');
        option.value = String(algorithm);
        option.text = String(algorithm);
        selectionElement.add(option);
    }
}

window.onload = () => {
    const selectionElement = document.getElementById('selected-algorithm') as HTMLSelectElement;
    const warmupRoundsElement = document.getElementById('warmup-rounds') as HTMLInputElement;
    const measureRoundsElement = document.getElementById('measure-rounds') as HTMLInputElement;
    createSelection(selectionElement);

    (document.getElementById('start-measurement-button') as HTMLButtonElement).addEventListener('click', () => {
        const selectedAlgorithm = selectionElement.options[selectionElement.selectedIndex].value;
        const warmupRounds = Number(warmupRoundsElement.value);
        const measureRounds = Number(measureRoundsElement.value);

        const algorithm = algorithms.get(selectedAlgorithm);

        if (algorithm === undefined) {
            console.error('No algorithm selected');
        } else {
            logResult(new Benchmark().benchmark(algorithm, warmupRounds, measureRounds));
        }
    });
};
