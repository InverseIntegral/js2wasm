import {expect} from 'chai';
import {Transpiler} from '../../src/transpiler';

describe('Transpiler', () => {

    let transpiler: Transpiler;

    beforeEach(() => {
        transpiler = new Transpiler();
    });

    describe('#transpile()', () => {
        it('should handle addition', () => {
            const exports = transpiler.transpile('function add(a, b) { return a + b; }');

            expect(exports('add', 1, 2)).to.equal(3);
            expect(exports('add', 100, 2)).to.equal(102);
            expect(exports('add', -20, 20)).to.equal(0);
            expect(exports('add', NaN, 2)).to.equal(2);
        });

        it('should handle subtraction', () => {
            const exports = transpiler.transpile('function sub(a, b) { return a - b; }');

            expect(exports('sub', 1, 2)).to.equal(-1);
            expect(exports('sub', 10, 2)).to.equal(8);
            expect(exports('sub', -20, 20)).to.equal(-40);
            expect(exports('sub', NaN, 2)).to.equal(-2);
        });

        it('should handle multiplication', () => {
            const exports = transpiler.transpile('function mul(a, b) { return a * b }');

            expect(exports('mul', 1, 2)).to.equal(2);
            expect(exports('mul', 10, 2)).to.equal(20);
            expect(exports('mul', -10, 2)).to.equal(-20);
            expect(exports('mul', NaN, 2)).to.equal(0);
        });

        it('should handle multiplication before addition', () => {
            const exports = transpiler.transpile('function mul(a, b, c) { return a + b * c }');

            expect(exports('mul', 3, 2, 5)).to.equal(13);
        });

        it('should handle multiplication before subtraction', () => {
            const exports = transpiler.transpile('function mul(a, b, c) { return a - b * c }');

            expect(exports('mul', 3, 2, 5)).to.equal(-7);
        });

        it('should handle division', () => {
            const exports = transpiler.transpile('function div(a, b) { return a / b }');

            expect(exports('div', 1, 2)).to.equal(0);
            expect(exports('div', 10, 2)).to.equal(5);
            expect(exports('div', -10, 2)).to.equal(-5);
            expect(exports('div', NaN, 2)).to.equal(0);
        });

        it('should handle division by 0', () => {
            const exports = transpiler.transpile('function div(a, b) { return a / b }');

            expect(() => exports('div', 2, 0)).to.throw();
            expect(() => exports('div', 2, NaN)).to.throw();
        });

        it('should handle division before addition', () => {
            const exports = transpiler.transpile('function div(a, b, c) { return a + b / c }');

            expect(exports('div', 3, 10, 5)).to.equal(5);
        });

        it('should handle division before subtraction', () => {
            const exports = transpiler.transpile('function div(a, b, c) { return a - b / c }');

            expect(exports('div', 3, 10, 5)).to.equal(1);
        });

        it('should handle modulo', () => {
            const exports = transpiler.transpile('function mod(a, b) { return a % b }');

            expect(exports('mod', 1, 2)).to.equal(1);
            expect(exports('mod', 10, 2)).to.equal(0);
            expect(exports('mod', -10, 2)).to.equal(0);
            expect(exports('mod', NaN, 2)).to.equal(0);
        });

        it('should handle modulo by 0', () => {
            const exports = transpiler.transpile('function mod(a, b) { return a % b }');

            expect(() => exports('mod', 2, 0)).to.throw();
            expect(() => exports('mod', 2, NaN)).to.throw();
        });

        it('should handle modulo before addition', () => {
            const exports = transpiler.transpile('function mod(a, b, c) { return a + b % c }');

            expect(exports('mod', 3, 10, 6)).to.equal(7);
        });

        it('should handle modulo before subtraction', () => {
            const exports = transpiler.transpile('function mod(a, b, c) { return a - b % c }');

            expect(exports('mod', 3, 10, 6)).to.equal(-1);
        });

        it('should handle equality', () => {
            const exports = transpiler.transpile('function eq(a, b) { return a == b }');

            expect(exports('eq', 3, 3)).to.equal(1);
            expect(exports('eq', 3, 2)).to.equal(0);
        });

        it('should handle inequality', () => {
            const exports = transpiler.transpile('function neq(a, b) { return a != b }');

            expect(exports('neq', 3, 2)).to.equal(1);
            expect(exports('neq', 3, 3)).to.equal(0);
        });

        it('should handle less than', () => {
            const exports = transpiler.transpile('function lt(a, b) { return a < b }');

            expect(exports('lt', 3, 2)).to.equal(0);
            expect(exports('lt', 3, 3)).to.equal(0);
            expect(exports('lt', 3, 4)).to.equal(1);
            expect(exports('lt', -3, -4)).to.equal(0);
            expect(exports('lt', -4, -3)).to.equal(1);
        });

        it('should handle less than or equal to', () => {
            const exports = transpiler.transpile('function le(a, b) { return a <= b }');

            expect(exports('le', 3, 2)).to.equal(0);
            expect(exports('le', 3, 3)).to.equal(1);
            expect(exports('le', 3, 4)).to.equal(1);
            expect(exports('le', -3, -4)).to.equal(0);
            expect(exports('le', -4, -3)).to.equal(1);
        });

        it('should handle greater than', () => {
            const exports = transpiler.transpile('function gt(a, b) { return a > b }');

            expect(exports('gt', 3, 2)).to.equal(1);
            expect(exports('gt', 3, 3)).to.equal(0);
            expect(exports('gt', 3, 4)).to.equal(0);
            expect(exports('gt', -3, -4)).to.equal(1);
            expect(exports('gt', -4, -3)).to.equal(0);
        });

        it('should handle greater than or equal to', () => {
            const exports = transpiler.transpile('function ge(a, b) { return a >= b }');

            expect(exports('ge', 3, 2)).to.equal(1);
            expect(exports('ge', 3, 3)).to.equal(1);
            expect(exports('ge', 3, 4)).to.equal(0);
            expect(exports('ge', -3, -4)).to.equal(1);
            expect(exports('ge', -4, -3)).to.equal(0);
        });

        it('should handle parenthesis', () => {
            const exports = transpiler.transpile('function sub(a, b) { return (a + 3) - (b + 2); }');
            expect(exports('sub', 10, 2)).to.equal(9);
        });

        it('should handle logical and', () => {
            const content = 'function and(a, b) { return a && b; }';
            const exports = transpiler.transpile(content);

            expect(exports('and', true, true)).to.equal(1);
            expect(exports('and', true, false)).to.equal(0);
            expect(exports('and', false, true)).to.equal(0);
            expect(exports('and', false, false)).to.equal(0);
        });

        it('should handle logical or', () => {
            const content = 'function or(a, b) { return a || b; }';
            const exports = transpiler.transpile(content);

            expect(exports('or', true, true)).to.equal(1);
            expect(exports('or', true, false)).to.equal(1);
            expect(exports('or', false, true)).to.equal(1);
            expect(exports('or', false, false)).to.equal(0);
        });

        it('should handle multiple logical operators', () => {
            const content = 'function logic(a, b, c) { return a || b && c; }';
            const exports = transpiler.transpile(content);

            expect(exports('logic', true, true, true)).to.equal(1);
            expect(exports('logic', true, true, false)).to.equal(1);
            expect(exports('logic', true, false, true)).to.equal(1);
            expect(exports('logic', true, false, false)).to.equal(1);
            expect(exports('logic', false, true, true)).to.equal(1);
            expect(exports('logic', false, true, false)).to.equal(0);
            expect(exports('logic', false, false, true)).to.equal(0);
            expect(exports('logic', false, false, false)).to.equal(0);
        });

        it('should handle expression statements', () => {
            const content = 'function add(a, b) { a + b; return a + b; }';
            const exports = transpiler.transpile(content);

            expect(exports('add', 1, 2)).to.equal(3);
            expect(exports('add', 10, 2)).to.equal(12);
            expect(exports('add', 0, 123)).to.equal(123);
            expect(exports('add', 123, 0)).to.equal(123);
            expect(exports('add', 0, 0)).to.equal(0);
            expect(exports('add', -20, -5)).to.equal(-25);
        });
    });
});
