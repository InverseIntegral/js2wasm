import {f64, i32} from 'binaryen';

enum WebAssemblyType {

    INT_32,
    INT_32_ARRAY,
    FLOAT_64,
    BOOLEAN,

}

function toBinaryenType(type: WebAssemblyType) {
    switch (type) {
        case WebAssemblyType.INT_32:
            return i32;
        case WebAssemblyType.INT_32_ARRAY:
            return i32;
        case WebAssemblyType.FLOAT_64:
            return f64;
        case WebAssemblyType.BOOLEAN:
            return i32;
        default:
            throw new Error(`Unknown type ${WebAssemblyType[type]}`);
    }
}

function getNumberType(value: number) {
    if (isInteger(value)) {
        return WebAssemblyType.INT_32;
    } else if (isDouble(value)) {
        return WebAssemblyType.FLOAT_64;
    } else {
        throw new Error(`The type of value ${value} is not supported`);
    }
}

function getCommonNumberType(leftType: WebAssemblyType, rightType: WebAssemblyType) {
    if (leftType === WebAssemblyType.FLOAT_64 || rightType === WebAssemblyType.FLOAT_64) {
        return WebAssemblyType.FLOAT_64;
    } else {
        return WebAssemblyType.INT_32;
    }
}

function isOfType(toCheck: any, type: WebAssemblyType) {
    switch (type) {
        case WebAssemblyType.INT_32:
            return isInteger(toCheck);
        case WebAssemblyType.INT_32_ARRAY:
            return isArray(toCheck, WebAssemblyType.INT_32);
        case WebAssemblyType.FLOAT_64:
            return isDouble(toCheck);
        case WebAssemblyType.BOOLEAN:
            return toCheck === true || toCheck === false;
        default:
            throw new Error(`Unknown type ${WebAssemblyType[type]}`);
    }
}

function isInteger(value: any) {
    return Number.isInteger(value);
}

function isDouble(value: any) {
    return Number.isFinite(value);
}

function isArray(value: any, type: WebAssemblyType) {
    if (!(value instanceof Array)) {
        return false;
    } else {
        switch (type) {
            case WebAssemblyType.INT_32:
                return value.every(isInteger);
            default:
                throw new Error(`Unknown array element type ${WebAssemblyType[type]}`);
        }
    }
}

export {WebAssemblyType, toBinaryenType, getNumberType, getCommonNumberType, isOfType};
