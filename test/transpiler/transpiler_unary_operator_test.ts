import {expect} from 'chai';
import Transpiler from '../../src/transpiler';

describe('Transpiler', () => {

    let transpiler: Transpiler;

    beforeEach(() => {
        transpiler = new Transpiler();
    });

    describe('#transpile()', () => {

        it('should handle unary plus', () => {
            const wrapper = transpiler.transpile('function func(a) { return +a + +40; }');
            wrapper.setFunctionName('func');

            expect(wrapper.call(2)).to.equal(42);
            expect(wrapper.call(-2)).to.equal(38);
        });

        it('should handle unary minus', () => {
            const wrapper = transpiler.transpile('function func(a) { return -a + -40; }');
            wrapper.setFunctionName('func');

            expect(wrapper.call(2)).to.equal(-42);
            expect(wrapper.call(-2)).to.equal(-38);
        });

        it('should handle multiple consecutive unary operators', () => {
            const wrapper = transpiler.transpile('function func(a) { return a + -+-+-40; }');

            expect(wrapper.setFunctionName('func').call(2)).to.equal(-38);
        });

        it('should handle unary not', () => {
            const wrapper = transpiler.transpile('function func(a) { return !a; }');
            wrapper.setFunctionName('func');

            expect(wrapper.call(true)).to.equal(0);
            expect(wrapper.call(false)).to.equal(1);
        });

        it('should handle pre increment', () => {
            const content = 'function preInc(a) { ++a; return a; }';
            const wrapper = transpiler.transpile(content);

            expect(wrapper.setFunctionName('preInc').call(10)).to.equal(11);
        });

        it('should handle post increment', () => {
            const content = 'function postInc(a) { a++; return a; }';
            const wrapper = transpiler.transpile(content);

            expect(wrapper.setFunctionName('postInc').call(10)).to.equal(11);
        });

        it('should handle pre decrement', () => {
            const content = 'function preDec(a) { --a; return a; }';
            const wrapper = transpiler.transpile(content);

            expect(wrapper.setFunctionName('preDec').call(10)).to.equal(9);
        });

        it('should handle post decrement', () => {
            const content = 'function postDec(a) { a--; return a; }';
            const wrapper = transpiler.transpile(content);

            expect(wrapper.setFunctionName('postDec').call(10)).to.equal(9);
        });
    });
});
