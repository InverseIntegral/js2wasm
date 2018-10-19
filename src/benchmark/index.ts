import fibonacci from './cases/fibonacci';
import newtonsMethod from './cases/newtons_method';
import isPrime from './cases/prime_counter';
import sumIntegers from './cases/sum_integers';
import {Algorithm, Measurement} from './measurement';

const algorithms = new Map<string, Algorithm>([
    ['Fibonacci', { func: fibonacci, arguments: [41] }],
    ['Sum Integers', { func: sumIntegers, arguments: [] }],
    ['isPrime', { func: isPrime, arguments: [32416190071] }],
    ['Newtons Method', { func: newtonsMethod, arguments: [200, 32]}],
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

function appendResult(result: [number[], number[]], log: HTMLElement, selectedAlgorithm: string) {
    const jsTimes = result[0];
    const wasmTimes = result[1];

    const jsMean = mean(jsTimes);
    const wasmMean = mean(wasmTimes);

    const jsVariance = variance(jsTimes);
    const wasmVariance = variance(wasmTimes);

    const currentLogContent = log.innerText;
    log.innerText = 'Name: ' + selectedAlgorithm + '\n';
    log.innerText += 'Average JavaScript time: ' + jsMean + '\n';
    log.innerText += 'Average WebAssembly time: ' + wasmMean + '\n';
    log.innerText += 'Variance JavaScript: ' + jsVariance + '\n';
    log.innerText += 'Variance WebAssembly: ' + wasmVariance + '\n';
    log.innerText += '\n';
    log.innerText += currentLogContent;

    console.log([jsMean, wasmMean, jsVariance, wasmVariance].toString());
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
    const resultLog = document.getElementById('result-log') as HTMLElement;
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
            const result = new Measurement(warmupRounds, measureRounds).measure(algorithm);
            appendResult(result, resultLog, selectedAlgorithm);
        }
    });
};
