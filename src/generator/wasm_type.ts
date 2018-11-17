import {i32} from 'binaryen';

enum WebAssemblyType {

    INT_32,
    INT_32_ARRAY,
    BOOLEAN,

}

function toBinaryenType(type: WebAssemblyType) {
    switch (type) {
        case WebAssemblyType.INT_32:
            return i32;
        case WebAssemblyType.INT_32_ARRAY:
            return i32;
        case WebAssemblyType.BOOLEAN:
            return i32;
        default:
            throw new Error(`Unknown type ${WebAssemblyType[type]}`);
    }
}

function isOfType(toCheck: any, type: WebAssemblyType) {
    switch (type) {
        case WebAssemblyType.INT_32:
            return isInt(toCheck);
        case WebAssemblyType.INT_32_ARRAY:
            return isArray(toCheck, WebAssemblyType.INT_32);
        case WebAssemblyType.BOOLEAN:
            return toCheck === true || toCheck === false;
        default:
            throw new Error(`Unknown type ${WebAssemblyType[type]}`);
    }
}

function isInt(value: any) {
    return !isNaN(value) &&
        // tslint:disable-next-line
        parseInt(value) == value &&
        !isNaN(parseInt(value, 10));
}

function isArray(value: any, type: WebAssemblyType) {
    const instanceOfArray = value instanceof Array;

    if (!instanceOfArray) {
        return false;
    } else {
        switch (type) {
            case WebAssemblyType.INT_32:
                return value.every(isInt);
            default:
                throw new Error(`Unknown array element type ${WebAssemblyType[type]}`);
        }
    }
}

export {WebAssemblyType, toBinaryenType, isOfType};
