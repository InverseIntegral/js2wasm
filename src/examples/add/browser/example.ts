import WasmInstance from './WasmInstance';

window.onload = () => {
    const leftInputElement = document.getElementById('left') as HTMLInputElement;
    const rightInputElement = document.getElementById('right') as HTMLInputElement;
    const resultElement = document.getElementById('result') as HTMLElement;
    const wasmInstance = new WasmInstance();

    (document.getElementById('calculate') as HTMLElement).addEventListener('click', () => {
        const left: number = Number(leftInputElement.value);
        const right: number = Number(rightInputElement.value);
        resultElement.innerText = String(wasmInstance.add(left, right));
    });
};
