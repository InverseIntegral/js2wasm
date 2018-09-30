import test_algorithm from './test_algorithm.js';
import Measurement from './Measurement.js';

const algorithms = {
    test_algorithm: test_algorithm
};

function appendResult(result, log, selectedAlgorithm, warmupRounds, measureRounds) {
    let currentLogContent = log.innerText;
    log.innerText = 'Name: ' + selectedAlgorithm + '\n';
    log.innerText += 'JavaScript Time: ' + result.jsTime + '\n';
    log.innerText += 'WebAssembly Time: ' + result.wasmTime + '\n';
    log.innerText += 'Time improvement: ' + (result.jsTime - result.wasmTime) + '\n';
    log.innerText += 'Warmup rounds amount: ' + warmupRounds + '\n';
    log.innerText += 'Measure rounds amount: ' + measureRounds + '\n';
    log.innerText += '\n';
    log.innerText += currentLogContent;
}

function createSelection(selectionElement) {
    for (let algorithm in algorithms) {
        let option = document.createElement('option');
        option.value = String(algorithm);
        option.text = String(algorithm);
        selectionElement.add(option);
    }
}

window.onload = () => {
    const selectionElement = document.getElementById('selected-algorithm');
    const resultLog = document.getElementById('result-log');
    const warmupRoundsElement = document.getElementById('warmup-rounds');
    const measureRoundsElement = document.getElementById('measure-rounds');
    createSelection(selectionElement);

    document.getElementById('start-measurement-button').addEventListener('click', () => {
        let selectedAlgorithm = selectionElement.options[selectionElement.selectedIndex].value;
        let warmupRounds = Number(warmupRoundsElement.value);
        let measureRounds = Number(measureRoundsElement.value);
        let measurement = new Measurement(warmupRounds, measureRounds);
        let result = measurement.executeMeasurement(algorithms[selectedAlgorithm]);
        appendResult(result, resultLog, selectedAlgorithm, warmupRounds, measureRounds);
    });
};
