import {expect} from 'chai';
import Transpiler from '../../src/transpiler';

describe('Transpiler', () => {

    let transpiler: Transpiler;

    beforeEach(() => {
        transpiler = new Transpiler();
    });

    describe('#transpile()', () => {

        it('should handle unary plus', () => {
            const exports = transpiler.transpile('function func(a) { return +a + +40; }');

            expect(exports('func', 2)).to.equal(42);
            expect(exports('func', -2)).to.equal(38);
        });

        it('should handle unary minus', () => {
            const exports = transpiler.transpile('function func(a) { return -a + -40; }');

            expect(exports('func', 2)).to.equal(-42);
            expect(exports('func', -2)).to.equal(-38);
        });

        it('should handle multiple consecutive unary operators', () => {
            const exports = transpiler.transpile('function func(a) { return a + -+-+-40; }');

            expect(exports('func', 2)).to.equal(-38);
        });

        it('should handle unary not', () => {
            const exports = transpiler.transpile('function func(a) { return !a; }');

            expect(exports('func', true)).to.equal(0);
            expect(exports('func', false)).to.equal(1);
        });

        it('should handle pre increment', () => {
            const content = 'function preInc(a) { ++a; return a; }';
            const exports = transpiler.transpile(content);

            expect(exports('preInc', 10)).to.equal(11);
        });

        it('should handle post increment', () => {
            const content = 'function postInc(a) { a++; return a; }';
            const exports = transpiler.transpile(content);

            expect(exports('postInc', 10)).to.equal(11);
        });

        it('should handle pre decrement', () => {
            const content = 'function preDec(a) { --a; return a; }';
            const exports = transpiler.transpile(content);

            expect(exports('preDec', 10)).to.equal(9);
        });

        it('should handle post decrement', () => {
            const content = 'function postDec(a) { a--; return a; }';
            const exports = transpiler.transpile(content);

            expect(exports('postDec', 10)).to.equal(9);
        });
    });
});
