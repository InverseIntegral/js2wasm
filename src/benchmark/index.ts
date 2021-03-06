import {WebAssemblyType} from '../generator/wasm_type';
import {Algorithm, Benchmark} from './benchmark';
import {countPrimes, isPrime} from './cases/count_primes';
import {fibonacci, fibonacciWhile} from './cases/fibonacci';
import {gcd, gcdWhile} from './cases/gcd';
import {
    mergeSortCopyArrayDouble,
    mergeSortDouble,
    mergeSortFillDouble,
    mergeSortIsSortedDouble,
    mergeSortMergeDouble,
    mergeSortWhileDouble,
} from './cases/mergesort_double';
import {
    mergeSortCopyArrayInteger,
    mergeSortFillInteger,
    mergeSortInteger,
    mergeSortIsSortedInteger,
    mergeSortMergeInteger,
    mergeSortWhileInteger,
} from './cases/mergesort_integer';
import {newtonsMethod, newtonsMethodWhile} from './cases/newtons_method';
import {
    quickSortDouble,
    quickSortFillDouble,
    quickSortIsSortedDouble,
    quickSortPartitionDouble,
    quickSortSwapDouble,
    quickSortWhileDouble,
} from './cases/quicksort_double';
import {
    quickSortFillInteger,
    quickSortInteger,
    quickSortIsSortedInteger,
    quickSortPartitionInteger,
    quickSortSwapInteger,
    quickSortWhileInteger,
} from './cases/quicksort_integer';
import {sumArrayDouble, sumArrayFillDouble, sumArrayForDouble} from './cases/sum_array_double';
import {sumArrayFillInteger, sumArrayForInteger, sumArrayInteger} from './cases/sum_array_integer';
import {Measurement} from './measurement_hooks';

const fibonacciFunc = {
    arguments: [41],
    expectedResult: 165580141,
    func: [fibonacciWhile, fibonacci],
    signatures: new Map([
        ['fibonacci', { parameterTypes: [WebAssemblyType.INT_32], returnType: WebAssemblyType.INT_32 }],
        ['fibonacciWhile', { parameterTypes: [WebAssemblyType.INT_32], returnType: WebAssemblyType.INT_32 }],
    ]),
};

const gcdFunc = {
    arguments: [978, 2147483646],
    expectedResult: 6,
    func: [gcdWhile, gcd],
    signatures: new Map([
        ['gcd', { parameterTypes: [WebAssemblyType.INT_32, WebAssemblyType.INT_32],
            returnType: WebAssemblyType.INT_32 }],
        ['gcdWhile', { parameterTypes: [WebAssemblyType.INT_32, WebAssemblyType.INT_32],
            returnType: WebAssemblyType.INT_32 }],
    ]),
};

const sumArrayIntegerFunc = {
    arguments: [new Array(65535)],
    expectedResult: 2147385345,
    func: [sumArrayForInteger, sumArrayFillInteger, sumArrayInteger],
    signatures: new Map([
        ['sumArrayInteger', { parameterTypes: [WebAssemblyType.INT_32_ARRAY], returnType: WebAssemblyType.INT_32 }],
        ['sumArrayFillInteger', { parameterTypes: [WebAssemblyType.INT_32_ARRAY], returnType: WebAssemblyType.INT_32 }],
        ['sumArrayForInteger', { parameterTypes: [WebAssemblyType.INT_32_ARRAY], returnType: WebAssemblyType.INT_32 }],
    ]),
};

const sumArrayDoubleFunc = {
    arguments: [new Array(65535)],
    expectedResult: 1073692672.5,
    func: [sumArrayForDouble, sumArrayFillDouble, sumArrayDouble],
    signatures: new Map([
        ['sumArrayDouble', { parameterTypes: [WebAssemblyType.FLOAT_64_ARRAY], returnType: WebAssemblyType.FLOAT_64 }],
        ['sumArrayFillDouble', { parameterTypes: [WebAssemblyType.FLOAT_64_ARRAY],
            returnType: WebAssemblyType.INT_32 }],
        ['sumArrayForDouble', { parameterTypes: [WebAssemblyType.FLOAT_64_ARRAY],
            returnType: WebAssemblyType.FLOAT_64 }],
    ]),
};

const countPrimesFunc = {
    arguments: [],
    expectedResult: 1270606,
    func: [countPrimes, isPrime],
    signatures: new Map([
        ['isPrime', { parameterTypes: [WebAssemblyType.INT_32], returnType: WebAssemblyType.BOOLEAN }],
        ['countPrimes', { parameterTypes: [], returnType: WebAssemblyType.INT_32 }],
    ]),
};

const newtonsMethodFunc = {
    arguments: [200, 32.1],
    expectedResult: 24.73863375370596,
    func: [newtonsMethodWhile, newtonsMethod],
    signatures: new Map([
        ['newtonsMethod', { parameterTypes: [WebAssemblyType.INT_32, WebAssemblyType.FLOAT_64],
            returnType: WebAssemblyType.FLOAT_64 }],
        ['newtonsMethodWhile', { parameterTypes: [WebAssemblyType.INT_32, WebAssemblyType.FLOAT_64],
            returnType: WebAssemblyType.FLOAT_64 }],
    ]),
};

const mergeSortIntegerFunc = {
    arguments: [new Array(Math.pow(2, 20)), new Array(Math.pow(2, 20))],
    expectedResult: true,
    func: [mergeSortWhileInteger, mergeSortCopyArrayInteger, mergeSortFillInteger,
        mergeSortIsSortedInteger, mergeSortMergeInteger, mergeSortInteger],
    signatures: new Map([
        ['mergeSortCopyArrayInteger', { parameterTypes: [WebAssemblyType.INT_32_ARRAY,
            WebAssemblyType.INT_32_ARRAY,
            WebAssemblyType.INT_32,
            WebAssemblyType.INT_32], returnType: WebAssemblyType.INT_32_ARRAY }],
        ['mergeSortInteger', { parameterTypes: [WebAssemblyType.INT_32_ARRAY,
            WebAssemblyType.INT_32_ARRAY,
            WebAssemblyType.INT_32,
            WebAssemblyType.INT_32], returnType: WebAssemblyType.INT_32_ARRAY }],
        ['mergeSortMergeInteger', { parameterTypes: [WebAssemblyType.INT_32_ARRAY,
            WebAssemblyType.INT_32_ARRAY,
            WebAssemblyType.INT_32,
            WebAssemblyType.INT_32,
            WebAssemblyType.INT_32], returnType: WebAssemblyType.INT_32_ARRAY }],
        ['mergeSortIsSortedInteger', { parameterTypes: [WebAssemblyType.INT_32_ARRAY],
            returnType: WebAssemblyType.BOOLEAN }],
        ['mergeSortFillInteger', { parameterTypes: [WebAssemblyType.INT_32_ARRAY],
            returnType: WebAssemblyType.INT_32 }],
        ['mergeSortWhileInteger', { parameterTypes: [WebAssemblyType.INT_32_ARRAY, WebAssemblyType.INT_32_ARRAY],
            returnType: WebAssemblyType.BOOLEAN }],
    ]),
};

const mergeSortDoubleFunc = {
    arguments: [new Array(Math.pow(2, 20)), new Array(Math.pow(2, 20))],
    expectedResult: true,
    func: [mergeSortWhileDouble, mergeSortCopyArrayDouble, mergeSortFillDouble,
        mergeSortIsSortedDouble, mergeSortMergeDouble, mergeSortDouble],
    signatures: new Map([
        ['mergeSortCopyArrayDouble', { parameterTypes: [WebAssemblyType.FLOAT_64_ARRAY,
            WebAssemblyType.FLOAT_64_ARRAY,
            WebAssemblyType.INT_32,
            WebAssemblyType.INT_32], returnType: WebAssemblyType.FLOAT_64_ARRAY }],
        ['mergeSortDouble', { parameterTypes: [WebAssemblyType.FLOAT_64_ARRAY,
            WebAssemblyType.FLOAT_64_ARRAY,
            WebAssemblyType.INT_32,
            WebAssemblyType.INT_32], returnType: WebAssemblyType.FLOAT_64_ARRAY }],
        ['mergeSortMergeDouble', { parameterTypes: [WebAssemblyType.FLOAT_64_ARRAY,
            WebAssemblyType.FLOAT_64_ARRAY,
            WebAssemblyType.INT_32,
            WebAssemblyType.INT_32,
            WebAssemblyType.INT_32], returnType: WebAssemblyType.FLOAT_64_ARRAY }],
        ['mergeSortIsSortedDouble', { parameterTypes: [WebAssemblyType.FLOAT_64_ARRAY],
            returnType: WebAssemblyType.BOOLEAN }],
        ['mergeSortFillDouble', { parameterTypes: [WebAssemblyType.FLOAT_64_ARRAY],
            returnType: WebAssemblyType.INT_32 }],
        ['mergeSortWhileDouble', { parameterTypes: [WebAssemblyType.FLOAT_64_ARRAY, WebAssemblyType.FLOAT_64_ARRAY],
            returnType: WebAssemblyType.BOOLEAN }],
    ]),
};

const quicksortIntegerFunc = {
    arguments: [new Array(Math.pow(2, 20))],
    expectedResult: true,
    func: [quickSortWhileInteger, quickSortIsSortedInteger, quickSortFillInteger,
        quickSortInteger, quickSortPartitionInteger, quickSortSwapInteger],
    signatures: new Map([
        ['quickSortSwapInteger', { parameterTypes: [WebAssemblyType.INT_32_ARRAY,
            WebAssemblyType.INT_32,
            WebAssemblyType.INT_32], returnType: WebAssemblyType.INT_32 }],
        ['quickSortPartitionInteger', { parameterTypes: [WebAssemblyType.INT_32_ARRAY,
            WebAssemblyType.INT_32,
            WebAssemblyType.INT_32], returnType: WebAssemblyType.INT_32 }],
        ['quickSortInteger', { parameterTypes: [WebAssemblyType.INT_32_ARRAY, WebAssemblyType.INT_32,
            WebAssemblyType.INT_32], returnType: WebAssemblyType.INT_32 }],
        ['quickSortFillInteger', { parameterTypes: [WebAssemblyType.INT_32_ARRAY],
            returnType: WebAssemblyType.INT_32 }],
        ['quickSortIsSortedInteger', { parameterTypes: [WebAssemblyType.INT_32_ARRAY],
            returnType: WebAssemblyType.BOOLEAN }],
        ['quickSortWhileInteger', { parameterTypes: [WebAssemblyType.INT_32_ARRAY],
            returnType: WebAssemblyType.BOOLEAN }],
    ]),
};

const quicksortDoubleFunc = {
    arguments: [new Array(Math.pow(2, 20))],
    expectedResult: true,
    func: [quickSortWhileDouble, quickSortIsSortedDouble, quickSortFillDouble,
        quickSortDouble, quickSortPartitionDouble, quickSortSwapDouble],
    signatures: new Map([
        ['quickSortSwapDouble', { parameterTypes: [WebAssemblyType.FLOAT_64_ARRAY,
            WebAssemblyType.INT_32,
            WebAssemblyType.INT_32], returnType: WebAssemblyType.INT_32 }],
        ['quickSortPartitionDouble', { parameterTypes: [WebAssemblyType.FLOAT_64_ARRAY,
            WebAssemblyType.INT_32,
            WebAssemblyType.INT_32], returnType: WebAssemblyType.INT_32 }],
        ['quickSortDouble', { parameterTypes: [WebAssemblyType.FLOAT_64_ARRAY, WebAssemblyType.INT_32,
            WebAssemblyType.INT_32], returnType: WebAssemblyType.FLOAT_64_ARRAY }],
        ['quickSortFillDouble', { parameterTypes: [WebAssemblyType.FLOAT_64_ARRAY],
            returnType: WebAssemblyType.INT_32 }],
        ['quickSortIsSortedDouble', { parameterTypes: [WebAssemblyType.FLOAT_64_ARRAY],
            returnType: WebAssemblyType.BOOLEAN }],
        ['quickSortWhileDouble', { parameterTypes: [WebAssemblyType.FLOAT_64_ARRAY],
            returnType: WebAssemblyType.BOOLEAN }],
    ]),
};

const algorithms = new Map<string, Algorithm>([
    ['Fibonacci', fibonacciFunc],
    ['Sum Array Integer', sumArrayIntegerFunc],
    ['Sum Array Double', sumArrayDoubleFunc],
    ['Count Primes', countPrimesFunc],
    ['Newtons Method', newtonsMethodFunc],
    ['gcd', gcdFunc],
    ['Quicksort Integer', quicksortIntegerFunc],
    ['Quicksort Double', quicksortDoubleFunc],
    ['Mergesort Integer', mergeSortIntegerFunc],
    ['Mergesort Double', mergeSortDoubleFunc],
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
