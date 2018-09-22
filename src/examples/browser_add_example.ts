import add from './browser_add_example_core';

window.onload = () => {
    const leftInputElement = document.getElementById('left') as HTMLInputElement;
    const rightInputElement = document.getElementById('right') as HTMLInputElement;
    const resultElement = document.getElementById('result') as HTMLElement;

    (document.getElementById('calculate') as HTMLElement).addEventListener('click', () => {
        const left: number = Number(leftInputElement.value);
        const right: number = Number(rightInputElement.value);
        resultElement.innerHTML = String(add(left, right));
    });
};
