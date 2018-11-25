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

            expect(wrapper.setFunctionName('double').call()).to.closeTo(1.34, 0.001);
        });

        it('should handle double parameter', () => {
            const wrapper = transpiler
                .setSignature('double', WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64)
                .transpile('function double(value) { return value; } ');

            expect(wrapper.setFunctionName('double').call(3.14)).to.closeTo(3.14, 0.001);
        });

        it('should handle double variable declaration with direct assignment', () => {
            const wrapper = transpiler
                .setSignature('double', WebAssemblyType.FLOAT_64)
                .transpile('function double() { var value = 5.3113; return value; } ');

            expect(wrapper.setFunctionName('double').call()).to.closeTo(5.3113, 0.00001);
        });

        it('should handle double variable declaration without direct assignment', () => {
            const wrapper = transpiler
                .setSignature('double', WebAssemblyType.FLOAT_64)
                .transpile('function double() { var value; value = 5.3113; return value; } ');

            expect(wrapper.setFunctionName('double').call()).to.closeTo(5.3113, 0.00001);
        });

        it('should handle double unary plus', () => {
            const wrapper = transpiler
                .setSignature('double', WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64)
                .transpile('function double(a) { return +a; }');
            wrapper.setFunctionName('double');

            expect(wrapper.call(31.412)).to.closeTo(31.412, 0.001);
            expect(wrapper.call(-231.4129)).to.closeTo(-231.4129, 0.00001);
        });

        it('should handle double unary minus', () => {
            const wrapper = transpiler
                .setSignature('double', WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64)
                .transpile('function double(a) { return -a ; }');
            wrapper.setFunctionName('double');

            expect(wrapper.call(132.319)).to.closeTo(-132.319, 0.0001);
            expect(wrapper.call(-18.95)).to.closeTo(18.95, 0.001);
        });

        it('should handle multiple consecutive double unary operators', () => {
            const wrapper = transpiler
                .setSignature('double', WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64)
                .transpile('function double(a) { return -+-+-a; }');
            wrapper.setFunctionName('double');

            expect(wrapper.call(2.12)).to.closeTo(-2.12, 0.001);
            expect(wrapper.call(-9.49)).to.closeTo(9.49, 0.001);
        });

        it('should handle double pre increment', () => {
            const content = 'function preInc(a) { ++a; return a; }';
            const wrapper = transpiler
                .setSignature('preInc', WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64)
                .transpile(content);

            expect(wrapper.setFunctionName('preInc').call(12.34)).to.closeTo(13.34, 0.001);
        });

        it('should handle double post increment', () => {
            const content = 'function postInc(a) { a++; return a; }';
            const wrapper = transpiler
                .setSignature('postInc', WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64)
                .transpile(content);

            expect(wrapper.setFunctionName('postInc').call(4.92)).to.closeTo(5.92, 0.001);
        });

        it('should handle double pre decrement', () => {
            const content = 'function preDec(a) { --a; return a; }';
            const wrapper = transpiler
                .setSignature('preDec', WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64)
                .transpile(content);

            expect(wrapper.setFunctionName('preDec').call(93.89)).to.closeTo(92.89, 0.001);
        });

        it('should handle double post decrement', () => {
            const content = 'function postDec(a) { a--; return a; }';
            const wrapper = transpiler
                .setSignature('postDec', WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64)
                .transpile(content);

            expect(wrapper.setFunctionName('postDec').call(28.19)).to.closeTo(27.19, 0.001);
        });
    });
});
