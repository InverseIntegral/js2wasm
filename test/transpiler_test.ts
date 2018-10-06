import {expect} from 'chai';
import Transpiler from '../src/Transpiler';

describe('Transpiler', () => {
    describe('#transpile()', () => {
        it('should handle unary plus', () => {
            const {func} = Transpiler.transpile('function func(a) { return +a + +40 }');

            expect(func(2)).to.equal(42);
            expect(func(-2)).to.equal(38);
        });

        it('should handle unary minus', () => {
            const {func} = Transpiler.transpile('function func(a) { return -a + -40 }');

            expect(func(2)).to.equal(-42);
            expect(func(-2)).to.equal(-38);
        });

        it('should handle multiple consecutive unary operators', () => {
            const {func} = Transpiler.transpile('function func(a) { return a + -+-+-40 }');

            expect(func(2)).to.equal(-38);
        });

        it('should handle unary not', () => {
            const {func} = Transpiler.transpile('function func(a) { return !a }');

            expect(func(1)).to.equal(0);
            expect(func(0)).to.equal(1);
        });

        it('should handle addition', () => {
            const {add} = Transpiler.transpile('function add(a, b) { return a + b; }');

            expect(add(1, 2)).to.equal(3);
            expect(add(100, 2)).to.equal(102);
            expect(add(-20, 20)).to.equal(0);
            expect(add(NaN, 2)).to.equal(2);
        });

        it('should handle subtraction', () => {
            const {sub} = Transpiler.transpile('function sub(a, b) { return a - b; }');

            expect(sub(1, 2)).to.equal(-1);
            expect(sub(10, 2)).to.equal(8);
            expect(sub(-20, 20)).to.equal(-40);
            expect(sub(NaN, 2)).to.equal(-2);
        });

        it('should handle numeric literals', () => {
            const {answer} = Transpiler.transpile('function answer() { return 42; }');
            expect(answer()).to.equal(42);
        });
    });
});
