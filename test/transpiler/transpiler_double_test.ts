import {expect} from 'chai';
import {WebAssemblyType} from '../../src/generator/wasm_type';
import Transpiler from '../../src/transpiler';

describe('Transpiler', () => {

    let transpiler: Transpiler;

    beforeEach(() => {
        transpiler = new Transpiler();
    });

    describe('#transpile()', () => {
        it('should handle double return value', () => {
            const wrapper = transpiler
                .setSignature('double', WebAssemblyType.FLOAT_64)
                .transpile('function double() { return 1.34; } ');

            expect(wrapper.setFunctionName('double').call()).to.equal(1.34);
        });

        it('should handle double parameter', () => {
            const wrapper = transpiler
                .setSignature('double', WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64)
                .transpile('function double(value) { return value; } ');

            expect(wrapper.setFunctionName('double').call(3.14)).to.equal(3.14);
        });

        it('should handle double variable declaration with direct assignment', () => {
            const wrapper = transpiler
                .setSignature('double', WebAssemblyType.FLOAT_64)
                .transpile('function double() { var value = 5.3113; return value; } ');

            expect(wrapper.setFunctionName('double').call()).to.equal(5.3113);
        });

        it('should handle double variable declaration without direct assignment', () => {
            const wrapper = transpiler
                .setSignature('double', WebAssemblyType.FLOAT_64)
                .transpile('function double() { var value; value = 5.3113; return value; } ');

            expect(wrapper.setFunctionName('double').call()).to.equal(5.3113);
        });
    });
});
