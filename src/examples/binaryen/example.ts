import Core from './Core';
import WasmInstance from './WasmInstance';

const core = new Core();
const wasmInstance = new WasmInstance(core.binaryArray);

console.log(core.unoptEmitText);

console.log('Optimized:\n' + core.optEmitText);

console.log('Binary: ' + core.binaryText);
console.log('Binary size: ' + core.binaryArray.length);
console.log();

console.log('Functions: ' + wasmInstance.functions);
console.log('Call: ' + wasmInstance.add(1, 2));
