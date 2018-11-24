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

        it('should handle double unary plus', () => {
            const wrapper = transpiler
                .setSignature('double', WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64)
                .transpile('function double(a) { return +a; }');
            wrapper.setFunctionName('double');

            expect(wrapper.call(31.412)).to.equal(31.412);
            expect(wrapper.call(-231.4129)).to.equal(-231.4129);
        });

        it('should handle double unary minus', () => {
            const wrapper = transpiler
                .setSignature('double', WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64)
                .transpile('function double(a) { return -a ; }');
            wrapper.setFunctionName('double');

            expect(wrapper.call(132.319)).to.equal(-132.319);
            expect(wrapper.call(-18.95)).to.equal(18.95);
        });

        it('should handle multiple consecutive double unary operators', () => {
            const wrapper = transpiler
                .setSignature('double', WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64)
                .transpile('function double(a) { return -+-+-a; }');
            wrapper.setFunctionName('double');

            expect(wrapper.call(2.12)).to.equal(-2.12);
            expect(wrapper.call(-9.49)).to.equal(9.49);
        });
    });
});
