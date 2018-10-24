import {expect} from 'chai';
import {createSingleIntegerOnlyFunction} from '../../src/generator/wasm_type';
import Transpiler from '../../src/transpiler';

describe('Transpiler', () => {
    describe('#transpile()', () => {

        it('should handle unary plus', () => {
            const content = 'function func(a) { return +a + +40; }';
            const {func} = Transpiler.transpile(content, createSingleIntegerOnlyFunction('func', 1));

            expect(func(2)).to.equal(42);
            expect(func(-2)).to.equal(38);
        });

        it('should handle unary minus', () => {
            const content = 'function func(a) { return -a + -40; }';
            const {func} = Transpiler.transpile(content, createSingleIntegerOnlyFunction('func', 1));

            expect(func(2)).to.equal(-42);
            expect(func(-2)).to.equal(-38);
        });

        it('should handle multiple consecutive unary operators', () => {
            const content = 'function func(a) { return a + -+-+-40; }';
            const {func} = Transpiler.transpile(content, createSingleIntegerOnlyFunction('func', 1));

            expect(func(2)).to.equal(-38);
        });

        it('should handle unary not', () => {
            const content = 'function func(a) { return !a; }';
            const {func} = Transpiler.transpile(content, createSingleIntegerOnlyFunction('func', 1));

            expect(func(true)).to.equal(0);
            expect(func(false)).to.equal(1);
        });

        it('should handle pre increment', () => {
            const content = 'function preInc(a) { ++a; return a; }';
            const {preInc} = Transpiler.transpile(content, createSingleIntegerOnlyFunction('preInc', 1));

            expect(preInc(10)).to.equal(11);
        });

        it('should handle post increment', () => {
            const content = 'function postInc(a) { a++; return a; }';
            const {postInc} = Transpiler.transpile(content, createSingleIntegerOnlyFunction('postInc', 1));

            expect(postInc(10)).to.equal(11);
        });

        it('should handle pre decrement', () => {
            const content = 'function preDec(a) { --a; return a; }';
            const {preDec} = Transpiler.transpile(content, createSingleIntegerOnlyFunction('preDec', 1));

            expect(preDec(10)).to.equal(9);
        });

        it('should handle post decrement', () => {
            const content = 'function postDec(a) { a--; return a; }';
            const {postDec} = Transpiler.transpile(content, createSingleIntegerOnlyFunction('postDec', 1));

            expect(postDec(10)).to.equal(9);
        });
    });
});
