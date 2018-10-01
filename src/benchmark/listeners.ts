import * as fibonacci from './cases/fibonacci';
import Measurement from './Measurement';

const algorithms: any = {
    fibonacci,
};

function sum(value1: number, value2: number): number {
    return value1 + value2;
}

function appendResult(result: [number[], number[]], log: HTMLElement,
                      selectedAlgorithm: string, warmupRounds: number, measureRounds: number) {
    const totalJsTime = result[0].reduce(sum, 0);
    const totalWasmTime = result[1].reduce(sum, 0);
    const currentLogContent = log.innerText;

    log.innerText = 'Name: ' + selectedAlgorithm + '\n';
    log.innerText += 'Total JavaScript time: ' + totalJsTime + '\n';
    log.innerText += 'Total WebAssembly time: ' + totalWasmTime + '\n';
    log.innerText += 'Total time improvement: ' + (totalJsTime - totalWasmTime) + '\n';
    log.innerText += 'Warmup rounds amount: ' + warmupRounds + '\n';
    log.innerText += 'Measure rounds amount: ' + measureRounds + '\n';
    log.innerText += '\n';
    log.innerText += currentLogContent;
}

function createSelection(selectionElement: HTMLSelectElement) {
    for (const algorithm in algorithms) {
        if (algorithms.hasOwnProperty(algorithm)) {
            const option: HTMLOptionElement = document.createElement('option');
            option.value = String(algorithm);
            option.text = String(algorithm);
            selectionElement.add(option);
        }
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
        const measurement = new Measurement(warmupRounds, measureRounds);
        const result = measurement.measure(algorithms[selectedAlgorithm]);
        appendResult(result, resultLog, selectedAlgorithm, warmupRounds, measureRounds);
    });
};
