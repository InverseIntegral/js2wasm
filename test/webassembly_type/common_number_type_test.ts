import {expect} from 'chai';
import {getCommonType, WebAssemblyType} from '../../src/generator/wasm_type';

describe('WebAssemblyType', () => {

    describe('#getCommonType()', () => {

        it('should handle boolean', () => {
            expect(getCommonType(WebAssemblyType.BOOLEAN, WebAssemblyType.BOOLEAN))
                .to.equal(WebAssemblyType.BOOLEAN);
        });

        it('should handle boolean with other types', () => {
            expect(() => getCommonType(WebAssemblyType.BOOLEAN, WebAssemblyType.INT_32)).to.throw();
            expect(() => getCommonType(WebAssemblyType.INT_32, WebAssemblyType.BOOLEAN)).to.throw();
            expect(() => getCommonType(WebAssemblyType.BOOLEAN, WebAssemblyType.FLOAT_64)).to.throw();
            expect(() => getCommonType(WebAssemblyType.FLOAT_64, WebAssemblyType.BOOLEAN)).to.throw();
            expect(() => getCommonType(WebAssemblyType.BOOLEAN, WebAssemblyType.INT_32_ARRAY)).to.throw();
            expect(() => getCommonType(WebAssemblyType.INT_32_ARRAY, WebAssemblyType.BOOLEAN)).to.throw();
        });

        it('should handle int and int', () => {
            expect(getCommonType(WebAssemblyType.INT_32, WebAssemblyType.INT_32))
                .to.equal(WebAssemblyType.INT_32);
        });

        it('should handle double and int', () => {
            expect(getCommonType(WebAssemblyType.FLOAT_64, WebAssemblyType.INT_32))
                .to.equal(WebAssemblyType.FLOAT_64);
        });

        it('should handle int and double', () => {
            expect(getCommonType(WebAssemblyType.INT_32, WebAssemblyType.FLOAT_64))
                .to.equal(WebAssemblyType.FLOAT_64);
        });

        it('should handle double and double', () => {
            expect(getCommonType(WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64))
                .to.equal(WebAssemblyType.FLOAT_64);
        });

        it('should handle int array', () => {
            expect(getCommonType(WebAssemblyType.INT_32_ARRAY, WebAssemblyType.INT_32_ARRAY))
                .to.equal(WebAssemblyType.INT_32_ARRAY);
        });

        it('should handle int array with other types', () => {
            expect(() => getCommonType(WebAssemblyType.INT_32_ARRAY, WebAssemblyType.INT_32)).to.throw();
            expect(() => getCommonType(WebAssemblyType.INT_32, WebAssemblyType.INT_32_ARRAY)).to.throw();
            expect(() => getCommonType(WebAssemblyType.INT_32_ARRAY, WebAssemblyType.FLOAT_64)).to.throw();
            expect(() => getCommonType(WebAssemblyType.FLOAT_64, WebAssemblyType.INT_32_ARRAY)).to.throw();
            expect(() => getCommonType(WebAssemblyType.INT_32_ARRAY, WebAssemblyType.BOOLEAN)).to.throw();
            expect(() => getCommonType(WebAssemblyType.BOOLEAN, WebAssemblyType.INT_32_ARRAY)).to.throw();
        });
    });
});
