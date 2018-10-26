import {expect} from 'chai';
import Transpiler from '../../src/transpiler';

describe('Transpiler', () => {
    describe('#transpile()', () => {

        it('should handle unary plus', () => {
            const func = Transpiler.transpile('function func(a) { return +a + +40; }');

            expect(func('func', 2)).to.equal(42);
            expect(func('func', -2)).to.equal(38);
        });

        it('should handle unary minus', () => {
            const func = Transpiler.transpile('function func(a) { return -a + -40; }');

            expect(func('func', 2)).to.equal(-42);
            expect(func('func', -2)).to.equal(-38);
        });

        it('should handle multiple consecutive unary operators', () => {
            const func = Transpiler.transpile('function func(a) { return a + -+-+-40; }');

            expect(func('func', 2)).to.equal(-38);
        });

        it('should handle unary not', () => {
            const func = Transpiler.transpile('function func(a) { return !a; }');

            expect(func('func', true)).to.equal(0);
            expect(func('func', false)).to.equal(1);
        });

        it('should handle pre increment', () => {
            const content = 'function preInc(a) { ++a; return a; }';
            const preInc = Transpiler.transpile(content);

            expect(preInc('preInc', 10)).to.equal(11);
        });

        it('should handle post increment', () => {
            const content = 'function postInc(a) { a++; return a; }';
            const postInc = Transpiler.transpile(content);

            expect(postInc('postInc', 10)).to.equal(11);
        });

        it('should handle pre decrement', () => {
            const content = 'function preDec(a) { --a; return a; }';
            const preDec = Transpiler.transpile(content);

            expect(preDec('preDec', 10)).to.equal(9);
        });

        it('should handle post decrement', () => {
            const content = 'function postDec(a) { a--; return a; }';
            const postDec = Transpiler.transpile(content);

            expect(postDec('postDec', 10)).to.equal(9);
        });
    });
});
