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
            const type = new Map([['func', [WebAssemblyType.INT_32]]]);
            const wrapper = transpiler.transpile('function func(a) { return +a + +40; }', type);
            wrapper.setFunctionName('func');

            expect(wrapper.call(2)).to.equal(42);
            expect(wrapper.call(-2)).to.equal(38);
        });

        it('should handle unary minus', () => {
            const type = new Map([['func', [WebAssemblyType.INT_32]]]);
            const wrapper = transpiler.transpile('function func(a) { return -a + -40; }', type);
            wrapper.setFunctionName('func');

            expect(wrapper.call(2)).to.equal(-42);
            expect(wrapper.call(-2)).to.equal(-38);
        });

        it('should handle multiple consecutive unary operators', () => {
            const type = new Map([['func', [WebAssemblyType.INT_32]]]);
            const wrapper = transpiler.transpile('function func(a) { return a + -+-+-40; }', type);

            expect(wrapper.setFunctionName('func').call(2)).to.equal(-38);
        });

        it('should handle unary not', () => {
            const type = new Map([['func', [WebAssemblyType.BOOLEAN]]]);
            const wrapper = transpiler.transpile('function func(a) { return !a; }', type);
            wrapper.setFunctionName('func');

            expect(wrapper.call(true)).to.equal(0);
            expect(wrapper.call(false)).to.equal(1);
        });

        it('should handle pre increment', () => {
            const type = new Map([['preInc', [WebAssemblyType.INT_32]]]);
            const content = 'function preInc(a) { ++a; return a; }';
            const wrapper = transpiler.transpile(content, type);

            expect(wrapper.setFunctionName('preInc').call(10)).to.equal(11);
        });

        it('should handle post increment', () => {
            const type = new Map([['postInc', [WebAssemblyType.INT_32]]]);
            const content = 'function postInc(a) { a++; return a; }';
            const wrapper = transpiler.transpile(content, type);

            expect(wrapper.setFunctionName('postInc').call(10)).to.equal(11);
        });

        it('should handle pre decrement', () => {
            const type = new Map([['preDec', [WebAssemblyType.INT_32]]]);
            const content = 'function preDec(a) { --a; return a; }';
            const wrapper = transpiler.transpile(content, type);

            expect(wrapper.setFunctionName('preDec').call(10)).to.equal(9);
        });

        it('should handle post decrement', () => {
            const type = new Map([['postDec', [WebAssemblyType.INT_32]]]);
            const content = 'function postDec(a) { a--; return a; }';
            const wrapper = transpiler.transpile(content, type);

            expect(wrapper.setFunctionName('postDec').call(10)).to.equal(9);
        });
    });
});
