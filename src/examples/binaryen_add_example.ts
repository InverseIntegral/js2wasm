import * as binaryen from 'binaryen';

const binaryenModule = new binaryen.Module();

const functionType = binaryenModule.addFunctionType('adderType', binaryen.i32, [binaryen.i32, binaryen.i32]);

const left = binaryenModule.getLocal(0, binaryen.i32);
const right = binaryenModule.getLocal(1, binaryen.i32);
const add = binaryenModule.i32.add(left, right);
const result = binaryenModule.return(add);

binaryenModule.addFunction('add', functionType, [], result);

binaryenModule.addFunctionExport('add', 'add');

console.log(binaryenModule.emitText());

binaryenModule.optimize();

console.log('Optimized:\n' + binaryenModule.emitText());

const binary = binaryenModule.emitBinary();
console.log('Binary: ' + binary);
console.log('Binary size: ' + binary.length);
console.log();

binaryenModule.dispose();

const wasm = new WebAssembly.Instance(new WebAssembly.Module(binary), {});
console.log('Functions: ' + Object.keys(wasm.exports).sort().join(','));
console.log('Call: ' + wasm.exports.add(1, 2));
