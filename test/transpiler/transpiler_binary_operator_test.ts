import {expect} from 'chai';
import Transpiler from '../../src/transpiler';

describe('Transpiler', () => {

    let transpiler: Transpiler;

    beforeEach(() => {
        transpiler = new Transpiler();
    });

    describe('#transpile()', () => {
        it('should handle addition', () => {
            const exports = transpiler.transpile('function add(a, b) { return a + b; }');
            exports.setFunctionName('add');

            expect(exports.call(1, 2)).to.equal(3);
            expect(exports.call(100, 2)).to.equal(102);
            expect(exports.call(-20, 20)).to.equal(0);
            expect(exports.call(NaN, 2)).to.equal(2);
        });

        it('should handle subtraction', () => {
            const exports = transpiler.transpile('function sub(a, b) { return a - b; }');
            exports.setFunctionName('sub');

            expect(exports.call(1, 2)).to.equal(-1);
            expect(exports.call(10, 2)).to.equal(8);
            expect(exports.call(-20, 20)).to.equal(-40);
            expect(exports.call(NaN, 2)).to.equal(-2);
        });

        it('should handle multiplication', () => {
            const exports = transpiler.transpile('function mul(a, b) { return a * b }');
            exports.setFunctionName('mul');

            expect(exports.call(1, 2)).to.equal(2);
            expect(exports.call(10, 2)).to.equal(20);
            expect(exports.call(-10, 2)).to.equal(-20);
            expect(exports.call(NaN, 2)).to.equal(0);
        });

        it('should handle multiplication before addition', () => {
            const exports = transpiler.transpile('function mul(a, b, c) { return a + b * c }');

            expect(exports.setFunctionName('mul').call(3, 2, 5)).to.equal(13);
        });

        it('should handle multiplication before subtraction', () => {
            const exports = transpiler.transpile('function mul(a, b, c) { return a - b * c }');

            expect(exports.setFunctionName('mul').call(3, 2, 5)).to.equal(-7);
        });

        it('should handle division', () => {
            const exports = transpiler.transpile('function div(a, b) { return a / b }');
            exports.setFunctionName('div');

            expect(exports.call(1, 2)).to.equal(0);
            expect(exports.call(10, 2)).to.equal(5);
            expect(exports.call(-10, 2)).to.equal(-5);
            expect(exports.call(NaN, 2)).to.equal(0);
        });

        it('should handle division by 0', () => {
            const exports = transpiler.transpile('function div(a, b) { return a / b }');
            exports.setFunctionName('div');

            expect(() => exports.call(2, 0)).to.throw();
            expect(() => exports.call(2, NaN)).to.throw();
        });

        it('should handle division before addition', () => {
            const exports = transpiler.transpile('function div(a, b, c) { return a + b / c }');

            expect(exports.setFunctionName('div').call(3, 10, 5)).to.equal(5);
        });

        it('should handle division before subtraction', () => {
            const exports = transpiler.transpile('function div(a, b, c) { return a - b / c }');

            expect(exports.setFunctionName('div').call(3, 10, 5)).to.equal(1);
        });

        it('should handle modulo', () => {
            const exports = transpiler.transpile('function mod(a, b) { return a % b }');
            exports.setFunctionName('mod');

            expect(exports.call(1, 2)).to.equal(1);
            expect(exports.call(10, 2)).to.equal(0);
            expect(exports.call(-10, 2)).to.equal(0);
            expect(exports.call(NaN, 2)).to.equal(0);
        });

        it('should handle modulo by 0', () => {
            const exports = transpiler.transpile('function mod(a, b) { return a % b }');
            exports.setFunctionName('mod');

            expect(() => exports.call(2, 0)).to.throw();
            expect(() => exports.call(2, NaN)).to.throw();
        });

        it('should handle modulo before addition', () => {
            const exports = transpiler.transpile('function mod(a, b, c) { return a + b % c }');

            expect(exports.setFunctionName('mod').call(3, 10, 6)).to.equal(7);
        });

        it('should handle modulo before subtraction', () => {
            const exports = transpiler.transpile('function mod(a, b, c) { return a - b % c }');

            expect(exports.setFunctionName('mod').call(3, 10, 6)).to.equal(-1);
        });

        it('should handle equality', () => {
            const exports = transpiler.transpile('function eq(a, b) { return a == b }');
            exports.setFunctionName('eq');

            expect(exports.call(3, 3)).to.equal(1);
            expect(exports.call(3, 2)).to.equal(0);
        });

        it('should handle inequality', () => {
            const exports = transpiler.transpile('function neq(a, b) { return a != b }');
            exports.setFunctionName('neq');

            expect(exports.call(3, 2)).to.equal(1);
            expect(exports.call(3, 3)).to.equal(0);
        });

        it('should handle less than', () => {
            const exports = transpiler.transpile('function lt(a, b) { return a < b }');
            exports.setFunctionName('lt');

            expect(exports.call(3, 2)).to.equal(0);
            expect(exports.call(3, 3)).to.equal(0);
            expect(exports.call(3, 4)).to.equal(1);
            expect(exports.call(-3, -4)).to.equal(0);
            expect(exports.call(-4, -3)).to.equal(1);
        });

        it('should handle less than or equal to', () => {
            const exports = transpiler.transpile('function le(a, b) { return a <= b }');
            exports.setFunctionName('le');

            expect(exports.call(3, 2)).to.equal(0);
            expect(exports.call(3, 3)).to.equal(1);
            expect(exports.call(3, 4)).to.equal(1);
            expect(exports.call(-3, -4)).to.equal(0);
            expect(exports.call(-4, -3)).to.equal(1);
        });

        it('should handle greater than', () => {
            const exports = transpiler.transpile('function gt(a, b) { return a > b }');
            exports.setFunctionName('gt');

            expect(exports.call(3, 2)).to.equal(1);
            expect(exports.call(3, 3)).to.equal(0);
            expect(exports.call(3, 4)).to.equal(0);
            expect(exports.call(-3, -4)).to.equal(1);
            expect(exports.call(-4, -3)).to.equal(0);
        });

        it('should handle greater than or equal to', () => {
            const exports = transpiler.transpile('function ge(a, b) { return a >= b }');
            exports.setFunctionName('ge');

            expect(exports.call(3, 2)).to.equal(1);
            expect(exports.call(3, 3)).to.equal(1);
            expect(exports.call(3, 4)).to.equal(0);
            expect(exports.call(-3, -4)).to.equal(1);
            expect(exports.call(-4, -3)).to.equal(0);
        });

        it('should handle parenthesis', () => {
            const exports = transpiler.transpile('function sub(a, b) { return (a + 3) - (b + 2); }');
            expect(exports.setFunctionName('sub').call(10, 2)).to.equal(9);
        });

        it('should handle logical and', () => {
            const content = 'function and(a, b) { return a && b; }';
            const exports = transpiler.transpile(content);
            exports.setFunctionName('and');

            expect(exports.call(true, true)).to.equal(1);
            expect(exports.call(true, false)).to.equal(0);
            expect(exports.call(false, true)).to.equal(0);
            expect(exports.call(false, false)).to.equal(0);
        });

        it('should handle logical or', () => {
            const content = 'function or(a, b) { return a || b; }';
            const exports = transpiler.transpile(content);
            exports.setFunctionName('or');

            expect(exports.call(true, true)).to.equal(1);
            expect(exports.call(true, false)).to.equal(1);
            expect(exports.call(false, true)).to.equal(1);
            expect(exports.call(false, false)).to.equal(0);
        });

        it('should handle multiple logical operators', () => {
            const content = 'function logic(a, b, c) { return a || b && c; }';
            const exports = transpiler.transpile(content);
            exports.setFunctionName('logic');

            expect(exports.call(true, true, true)).to.equal(1);
            expect(exports.call(true, true, false)).to.equal(1);
            expect(exports.call(true, false, true)).to.equal(1);
            expect(exports.call(true, false, false)).to.equal(1);
            expect(exports.call(false, true, true)).to.equal(1);
            expect(exports.call(false, true, false)).to.equal(0);
            expect(exports.call(false, false, true)).to.equal(0);
            expect(exports.call(false, false, false)).to.equal(0);
        });

        it('should handle expression statements', () => {
            const content = 'function add(a, b) { a + b; return a + b; }';
            const exports = transpiler.transpile(content);
            exports.setFunctionName('add');

            expect(exports.call(1, 2)).to.equal(3);
            expect(exports.call(10, 2)).to.equal(12);
            expect(exports.call(0, 123)).to.equal(123);
            expect(exports.call(123, 0)).to.equal(123);
            expect(exports.call(0, 0)).to.equal(0);
            expect(exports.call(-20, -5)).to.equal(-25);
        });
    });
});
