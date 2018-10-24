import {i32} from 'binaryen';

enum WebAssemblyType {

    INT_32,

}

function toBinaryenType(type: WebAssemblyType) {
    switch (type) {
        case WebAssemblyType.INT_32:
            return i32;
        default:
            throw new Error('Unknown type');
    }
}

const createIntegerOnlyFunction = (amountOfParameters: number) => {
    return {
        parameterTypes: new Array(amountOfParameters).fill(WebAssemblyType.INT_32),
        returnType: WebAssemblyType.INT_32,
    };
};

const createSingleIntegerOnlyFunction = (name: string, amountOfParameters: number) => {
    return new Map([
        [name, createIntegerOnlyFunction(amountOfParameters)],
    ]);
};

const createMultipleIntegerOnlyFunctions = (names: string[], amountOfParameters: number[]) => {
    const functionTypes = new Map();

    for (let i = 0; i < names.length; i++) {
        functionTypes.set(names[i], createIntegerOnlyFunction(amountOfParameters[i]));
    }

    return functionTypes;
};

export {WebAssemblyType, toBinaryenType, createSingleIntegerOnlyFunction, createMultipleIntegerOnlyFunctions};
