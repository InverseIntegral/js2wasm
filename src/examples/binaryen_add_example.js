let binaryen = require('binaryen');

let binaryenModule = new binaryen.Module();

let functionType = binaryenModule.addFunctionType('adderType', binaryen.i32, [binaryen.i32, binaryen.i32]);

let left = binaryenModule.getLocal(0, binaryen.i32);
let right = binaryenModule.getLocal(1, binaryen.i32);
let add = binaryenModule.i32.add(left, right);
let result = binaryenModule.return(add);

binaryenModule.addFunction('add', functionType, [], result);

binaryenModule.addFunctionExport('add', 'add');

console.log(binaryenModule.emitText());

binaryenModule.optimize();

console.log('Optimized:\n' + binaryenModule.emitText());

let binary = binaryenModule.emitBinary();
console.log('Binary: ' + binary);
console.log('Binary size: ' + binary.length);
console.log();

binaryenModule.dispose();

let wasm = new WebAssembly.Instance(new WebAssembly.Module(binary), {});
console.log("Functions: " + Object.keys(wasm.exports).sort().join(','));
console.log('Call: ' + wasm.exports.add(1, 2));