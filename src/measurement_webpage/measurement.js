import test_algorithm from './test_algorithm.js';

const algorithms = {
    test_algorithm: test_algorithm
};

const warmupRounds = 5;
const measureRounds = 100;

function appendResult(result, log) {
    let currentLogContent = log.innerText;
    log.innerText = 'Name: ' + result.selectedAlgorithm + '\n';
    log.innerText += 'JavaScript Time: ' + result.jsTime + '\n';
    log.innerText += 'WebAssembly Time: ' + result.wasmTime + '\n';
    log.innerText += 'Time improvement: ' + (result.jsTime - result.wasmTime) + '\n';
    log.innerText += '\n';
    log.innerText += currentLogContent;
}

function executeAlgorithm(algorithm, rounds) {
    for (let i = 0; i < rounds; i++) {
        algorithm();
    }
}

function measureTime(algorithm) {
    let startTime = Date.now();
    executeAlgorithm(algorithm, measureRounds);
    let endTime = Date.now();
    return endTime - startTime;
}

function executeMeasurement(selectedAlgorithmName) {
    let jsAlgorithm = algorithms[selectedAlgorithmName];

    executeAlgorithm(jsAlgorithm, warmupRounds);
    let jsTime = measureTime(jsAlgorithm);

    // cross compile here
    let wasmAlgorithm = jsAlgorithm; // change to cross compiled function
    executeAlgorithm(wasmAlgorithm, warmupRounds);
    let wasmTime = measureTime(wasmAlgorithm);

    return {selectedAlgorithm: selectedAlgorithmName, jsTime, wasmTime};
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
    createSelection(selectionElement);

    document.getElementById('start-measurement-button').addEventListener('click', () => {
        let selectedAlgorithm = selectionElement.options[selectionElement.selectedIndex].value;
        let result = executeMeasurement(selectedAlgorithm);
        appendResult(result, resultLog);
    });
};
