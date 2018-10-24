import {WebAssemblyType} from './wasm_type';

interface Function {
    parameterTypes: WebAssemblyType[];
    returnType: WebAssemblyType;
}

export default Function;
