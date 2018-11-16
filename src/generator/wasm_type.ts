import {i32} from 'binaryen';

enum WebAssemblyType {

    INT_32,
    INT_32_ARRAY,

}

function toBinaryenType(type: WebAssemblyType) {
    switch (type) {
        case WebAssemblyType.INT_32:
            return i32;
        case WebAssemblyType.INT_32_ARRAY:
            return i32;
        default:
            throw new Error('Unknown type');
    }
}

export {WebAssemblyType, toBinaryenType};
