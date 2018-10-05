import {expect} from 'chai';
import Transpiler from '../src/Transpiler';

describe('Transpiler', () => {
    describe('#transpile()', () => {
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

        it('should handle multiplication', () => {
            const {mul} = Transpiler.transpile('function mul(a, b) { return a * b }');

            expect(mul(1, 2)).to.equal(2);
            expect(mul(10, 2)).to.equal(20);
            expect(mul(-10, 2)).to.equal(-20);
            expect(mul(NaN, 2)).to.equal(0);
        });

        it('should handle multiplication before addition', () => {
            const {mul} = Transpiler.transpile('function mul(a, b, c) { return a + b * c }');

            expect(mul(3, 2, 5)).to.equal(13);
        });

        it('should handle multiplication before subtraction', () => {
            const {mul} = Transpiler.transpile('function mul(a, b, c) { return a - b * c }');

            expect(mul(3, 2, 5)).to.equal(-7);
        });

        it('should handle division', () => {
            const {div} = Transpiler.transpile('function div(a, b) { return a / b }');

            expect(div(1, 2)).to.equal(0);
            expect(div(10, 2)).to.equal(5);
            expect(div(-10, 2)).to.equal(-5);
            expect(div(NaN, 2)).to.equal(0);
        });

        it('should handle division by 0', () => {
            const {div} = Transpiler.transpile('function div(a, b) { return a / b }');

            expect(() => div(2, 0)).to.throw();
            expect(() => div(2, NaN)).to.throw();
        });

        it('should handle division before addition', () => {
            const {div} = Transpiler.transpile('function div(a, b, c) { return a + b / c }');

            expect(div(3, 10, 5)).to.equal(5);
        });

        it('should handle division before subtraction', () => {
            const {div} = Transpiler.transpile('function div(a, b, c) { return a - b / c }');

            expect(div(3, 10, 5)).to.equal(1);
        });

        it('should handle modulo', () => {
            const {mod} = Transpiler.transpile('function mod(a, b) { return a % b }');

            expect(mod(1, 2)).to.equal(1);
            expect(mod(10, 2)).to.equal(0);
            expect(mod(-10, 2)).to.equal(0);
            expect(mod(NaN, 2)).to.equal(0);
        });

        it('should handle modulo by 0', () => {
            const {mod} = Transpiler.transpile('function mod(a, b) { return a % b }');

            expect(() => mod(2, 0)).to.throw();
            expect(() => mod(2, NaN)).to.throw();
        });

        it('should handle modulo before addition', () => {
            const {mod} = Transpiler.transpile('function mod(a, b, c) { return a + b % c }');

            expect(mod(3, 10, 6)).to.equal(7);
        });

        it('should handle modulo before subtraction', () => {
            const {mod} = Transpiler.transpile('function mod(a, b, c) { return a - b % c }');

            expect(mod(3, 10, 6)).to.equal(-1);
        });

        it('should handle equality', () => {
            const {eq} = Transpiler.transpile('function eq(a, b) { return a == b }');

            expect(eq(3, 3)).to.equal(1);
            expect(eq(3, 2)).to.equal(0);
        });

        it('should handle inequality', () => {
            const {neq} = Transpiler.transpile('function neq(a, b) { return a != b }');

            expect(neq(3, 2)).to.equal(1);
            expect(neq(3, 3)).to.equal(0);
        });

        it('should handle numeric literals', () => {
            const {answer} = Transpiler.transpile('function answer() { return 42; }');
            expect(answer()).to.equal(42);
        });
    });
});
