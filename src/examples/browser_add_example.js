window.onload = function () {
    document.getElementById('calculate').addEventListener('click', function () {
        let left = document.getElementById('left').value;
        let right = document.getElementById('right').value;

        let binary = new Uint8Array([0,97,115,109,1,0,0,0,1,7,1,96,2,127,127,1,127,3,2,1,0,7,7,1,3,97,100,100,0,0,10,9,1,7,0,32,0,32,1,106,11]).buffer;
        let wasm = new WebAssembly.Instance(new WebAssembly.Module(binary), {});
        let result = wasm.exports.add(left, right);

        document.getElementById('result').innerHTML = result;
    });
};