import {expect} from 'chai';
import {getCommonNumberType, WebAssemblyType} from '../../src/generator/wasm_type';

describe('WebAssemblyType', () => {

    describe('#getCommonNumberType()', () => {

        it('should handle int and int', () => {
            expect(getCommonNumberType(WebAssemblyType.INT_32, WebAssemblyType.INT_32))
                .to.equal(WebAssemblyType.INT_32);
        });

        it('should handle double and int', () => {
            expect(getCommonNumberType(WebAssemblyType.FLOAT_64, WebAssemblyType.INT_32))
                .to.equal(WebAssemblyType.FLOAT_64);
        });

        it('should handle int and double', () => {
            expect(getCommonNumberType(WebAssemblyType.INT_32, WebAssemblyType.FLOAT_64))
                .to.equal(WebAssemblyType.FLOAT_64);
        });

        it('should handle double and double', () => {
            expect(getCommonNumberType(WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64))
                .to.equal(WebAssemblyType.FLOAT_64);
        });
    });
});
