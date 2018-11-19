import {expect} from 'chai';
import {WebAssemblyType} from '../../src/generator/wasm_type';
import Transpiler from '../../src/transpiler';

describe('Transpiler', () => {

    let transpiler: Transpiler;

    beforeEach(() => {
        transpiler = new Transpiler();
    });

    describe('#transpile()', () => {

        it('should handle unary plus', () => {
            const wrapper = transpiler
                .setSignature('func', WebAssemblyType.INT_32, WebAssemblyType.INT_32)
                .transpile('function func(a) { return +a + +40; }');
            wrapper.setFunctionName('func');

            expect(wrapper.call(2)).to.equal(42);
            expect(wrapper.call(-2)).to.equal(38);
        });

        it('should handle unary minus', () => {
            const type = new Map([['func', [WebAssemblyType.INT_32]]]);
            const wrapper = transpiler
                .setSignature('func', WebAssemblyType.INT_32, WebAssemblyType.INT_32)
                .transpile('function func(a) { return -a + -40; }');
            wrapper.setFunctionName('func');

            expect(wrapper.call(2)).to.equal(-42);
            expect(wrapper.call(-2)).to.equal(-38);
        });

        it('should handle multiple consecutive unary operators', () => {
            const wrapper = transpiler
                .setSignature('func', WebAssemblyType.INT_32, WebAssemblyType.INT_32)
                .transpile('function func(a) { return a + -+-+-40; }');

            expect(wrapper.setFunctionName('func').call(2)).to.equal(-38);
        });

        it('should handle unary not', () => {
            const wrapper = transpiler
                .setSignature('func', WebAssemblyType.BOOLEAN, WebAssemblyType.BOOLEAN)
                .transpile('function func(a) { return !a; }');
            wrapper.setFunctionName('func');

            expect(wrapper.call(true)).to.equal(0);
            expect(wrapper.call(false)).to.equal(1);
        });

        it('should handle pre increment', () => {
            const content = 'function preInc(a) { ++a; return a; }';
            const wrapper = transpiler
                .setSignature('preInc', WebAssemblyType.INT_32, WebAssemblyType.INT_32)
                .transpile(content);

            expect(wrapper.setFunctionName('preInc').call(10)).to.equal(11);
        });

        it('should handle post increment', () => {
            const content = 'function postInc(a) { a++; return a; }';
            const wrapper = transpiler
                .setSignature('postInc', WebAssemblyType.INT_32, WebAssemblyType.INT_32)
                .transpile(content);

            expect(wrapper.setFunctionName('postInc').call(10)).to.equal(11);
        });

        it('should handle pre decrement', () => {
            const content = 'function preDec(a) { --a; return a; }';
            const wrapper = transpiler
                .setSignature('preDec', WebAssemblyType.INT_32, WebAssemblyType.INT_32)
                .transpile(content);

            expect(wrapper.setFunctionName('preDec').call(10)).to.equal(9);
        });

        it('should handle post decrement', () => {
            const content = 'function postDec(a) { a--; return a; }';
            const wrapper = transpiler
                .setSignature('postDec', WebAssemblyType.INT_32, WebAssemblyType.INT_32)
                .transpile(content);

            expect(wrapper.setFunctionName('postDec').call(10)).to.equal(9);
        });
    });
});
