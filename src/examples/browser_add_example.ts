window.onload = () => {
    (document.getElementById('calculate') as HTMLElement).addEventListener('click', () => {
        const left: number = Number((document.getElementById('left') as HTMLInputElement).value);
        const right: number = Number((document.getElementById('right') as HTMLInputElement).value);
        (document.getElementById('result') as HTMLElement).innerHTML = String(calculate(left, right));
    });
};

function calculate(left: number, right: number): number {
    const binary: ArrayBuffer = new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 7, 1, 96, 2, 127, 127, 1, 127,
        3, 2, 1, 0, 7, 7, 1, 3, 97, 100, 100, 0, 0, 10, 9, 1, 7, 0, 32, 0, 32, 1, 106, 11]).buffer;
    const wasm: any = new WebAssembly.Instance(new WebAssembly.Module(binary), {});
    return wasm.exports.add(left, right);
}
