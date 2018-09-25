import Core from './Core';
import WasmInstance from './WasmInstance';

function appendStatistics(core: Core, wasmInstance: WasmInstance) {
    const unoptimizedEmitTextElement = document.getElementById('unoptimized-emit-text') as HTMLElement;
    const optimizedEmitTextElement = document.getElementById('optimized-emit-text') as HTMLElement;
    const arrayTextElement = document.getElementById('array-text') as HTMLElement;
    const arrayLengthElement = document.getElementById('array-length') as HTMLElement;
    const functionsElement = document.getElementById('functions') as HTMLElement;

    unoptimizedEmitTextElement.innerText = unoptimizedEmitTextElement.innerText + '\n' + core.unoptEmitText;
    optimizedEmitTextElement.innerText = optimizedEmitTextElement.innerText + '\n' + core.optEmitText;
    arrayTextElement.innerText = arrayTextElement.innerText + ' ' + String(core.binaryArray);
    arrayLengthElement.innerText = arrayLengthElement.innerText + ' ' + String(core.binaryArray.length);
    functionsElement.innerText = functionsElement.innerText + ' ' + wasmInstance.functions;
}

function registerListener(wasmInstance: WasmInstance) {
    const leftInputElement = document.getElementById('left') as HTMLInputElement;
    const rightInputElement = document.getElementById('right') as HTMLInputElement;
    const resultElement = document.getElementById('result') as HTMLElement;

    (document.getElementById('calculate') as HTMLElement).addEventListener('click', () => {
        const left: number = Number(leftInputElement.value);
        const right: number = Number(rightInputElement.value);
        resultElement.innerText = String(wasmInstance.add(left, right));
    });
}

window.onload = () => {
    const core = new Core();
    const wasmInstance = new WasmInstance(core.binaryArray);

    appendStatistics(core, wasmInstance);
    registerListener(wasmInstance);
};
