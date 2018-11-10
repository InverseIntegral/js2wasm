import {expect} from 'chai';
import Transpiler from '../../src/transpiler';

describe('Transpiler', () => {

    let transpiler: Transpiler;

    beforeEach(() => {
        transpiler = new Transpiler();
    });

    describe('#transpile()', () => {
        it('should handle addition', () => {
            const wrapper = transpiler.transpile('function add(a, b) { return a + b; }');
            wrapper.setFunctionName('add');

            expect(wrapper.call(1, 2)).to.equal(3);
            expect(wrapper.call(100, 2)).to.equal(102);
            expect(wrapper.call(-20, 20)).to.equal(0);
            expect(wrapper.call(NaN, 2)).to.equal(2);
        });

        it('should handle subtraction', () => {
            const wrapper = transpiler.transpile('function sub(a, b) { return a - b; }');
            wrapper.setFunctionName('sub');

            expect(wrapper.call(1, 2)).to.equal(-1);
            expect(wrapper.call(10, 2)).to.equal(8);
            expect(wrapper.call(-20, 20)).to.equal(-40);
            expect(wrapper.call(NaN, 2)).to.equal(-2);
        });

        it('should handle multiplication', () => {
            const wrapper = transpiler.transpile('function mul(a, b) { return a * b }');
            wrapper.setFunctionName('mul');

            expect(wrapper.call(1, 2)).to.equal(2);
            expect(wrapper.call(10, 2)).to.equal(20);
            expect(wrapper.call(-10, 2)).to.equal(-20);
            expect(wrapper.call(NaN, 2)).to.equal(0);
        });

        it('should handle multiplication before addition', () => {
            const wrapper = transpiler.transpile('function mul(a, b, c) { return a + b * c }');

            expect(wrapper.setFunctionName('mul').call(3, 2, 5)).to.equal(13);
        });

        it('should handle multiplication before subtraction', () => {
            const wrapper = transpiler.transpile('function mul(a, b, c) { return a - b * c }');

            expect(wrapper.setFunctionName('mul').call(3, 2, 5)).to.equal(-7);
        });

        it('should handle division', () => {
            const wrapper = transpiler.transpile('function div(a, b) { return a / b }');
            wrapper.setFunctionName('div');

            expect(wrapper.call(1, 2)).to.equal(0);
            expect(wrapper.call(10, 2)).to.equal(5);
            expect(wrapper.call(-10, 2)).to.equal(-5);
            expect(wrapper.call(NaN, 2)).to.equal(0);
        });

        it('should handle division by 0', () => {
            const wrapper = transpiler.transpile('function div(a, b) { return a / b }');
            wrapper.setFunctionName('div');

            expect(() => wrapper.call(2, 0)).to.throw();
            expect(() => wrapper.call(2, NaN)).to.throw();
        });

        it('should handle division before addition', () => {
            const wrapper = transpiler.transpile('function div(a, b, c) { return a + b / c }');

            expect(wrapper.setFunctionName('div').call(3, 10, 5)).to.equal(5);
        });

        it('should handle division before subtraction', () => {
            const wrapper = transpiler.transpile('function div(a, b, c) { return a - b / c }');

            expect(wrapper.setFunctionName('div').call(3, 10, 5)).to.equal(1);
        });

        it('should handle modulo', () => {
            const wrapper = transpiler.transpile('function mod(a, b) { return a % b }');
            wrapper.setFunctionName('mod');

            expect(wrapper.call(1, 2)).to.equal(1);
            expect(wrapper.call(10, 2)).to.equal(0);
            expect(wrapper.call(-10, 2)).to.equal(0);
            expect(wrapper.call(NaN, 2)).to.equal(0);
        });

        it('should handle modulo by 0', () => {
            const wrapper = transpiler.transpile('function mod(a, b) { return a % b }');
            wrapper.setFunctionName('mod');

            expect(() => wrapper.call(2, 0)).to.throw();
            expect(() => wrapper.call(2, NaN)).to.throw();
        });

        it('should handle modulo before addition', () => {
            const wrapper = transpiler.transpile('function mod(a, b, c) { return a + b % c }');

            expect(wrapper.setFunctionName('mod').call(3, 10, 6)).to.equal(7);
        });

        it('should handle modulo before subtraction', () => {
            const wrapper = transpiler.transpile('function mod(a, b, c) { return a - b % c }');

            expect(wrapper.setFunctionName('mod').call(3, 10, 6)).to.equal(-1);
        });

        it('should handle equality', () => {
            const wrapper = transpiler.transpile('function eq(a, b) { return a == b }');
            wrapper.setFunctionName('eq');

            expect(wrapper.call(3, 3)).to.equal(1);
            expect(wrapper.call(3, 2)).to.equal(0);
        });

        it('should handle inequality', () => {
            const wrapper = transpiler.transpile('function neq(a, b) { return a != b }');
            wrapper.setFunctionName('neq');

            expect(wrapper.call(3, 2)).to.equal(1);
            expect(wrapper.call(3, 3)).to.equal(0);
        });

        it('should handle less than', () => {
            const wrapper = transpiler.transpile('function lt(a, b) { return a < b }');
            wrapper.setFunctionName('lt');

            expect(wrapper.call(3, 2)).to.equal(0);
            expect(wrapper.call(3, 3)).to.equal(0);
            expect(wrapper.call(3, 4)).to.equal(1);
            expect(wrapper.call(-3, -4)).to.equal(0);
            expect(wrapper.call(-4, -3)).to.equal(1);
        });

        it('should handle less than or equal to', () => {
            const wrapper = transpiler.transpile('function le(a, b) { return a <= b }');
            wrapper.setFunctionName('le');

            expect(wrapper.call(3, 2)).to.equal(0);
            expect(wrapper.call(3, 3)).to.equal(1);
            expect(wrapper.call(3, 4)).to.equal(1);
            expect(wrapper.call(-3, -4)).to.equal(0);
            expect(wrapper.call(-4, -3)).to.equal(1);
        });

        it('should handle greater than', () => {
            const wrapper = transpiler.transpile('function gt(a, b) { return a > b }');
            wrapper.setFunctionName('gt');

            expect(wrapper.call(3, 2)).to.equal(1);
            expect(wrapper.call(3, 3)).to.equal(0);
            expect(wrapper.call(3, 4)).to.equal(0);
            expect(wrapper.call(-3, -4)).to.equal(1);
            expect(wrapper.call(-4, -3)).to.equal(0);
        });

        it('should handle greater than or equal to', () => {
            const wrapper = transpiler.transpile('function ge(a, b) { return a >= b }');
            wrapper.setFunctionName('ge');

            expect(wrapper.call(3, 2)).to.equal(1);
            expect(wrapper.call(3, 3)).to.equal(1);
            expect(wrapper.call(3, 4)).to.equal(0);
            expect(wrapper.call(-3, -4)).to.equal(1);
            expect(wrapper.call(-4, -3)).to.equal(0);
        });

        it('should handle parenthesis', () => {
            const wrapper = transpiler.transpile('function sub(a, b) { return (a + 3) - (b + 2); }');
            expect(wrapper.setFunctionName('sub').call(10, 2)).to.equal(9);
        });

        it('should handle logical and', () => {
            const content = 'function and(a, b) { return a && b; }';
            const wrapper = transpiler.transpile(content);
            wrapper.setFunctionName('and');

            expect(wrapper.call(true, true)).to.equal(1);
            expect(wrapper.call(true, false)).to.equal(0);
            expect(wrapper.call(false, true)).to.equal(0);
            expect(wrapper.call(false, false)).to.equal(0);
        });

        it('should handle logical or', () => {
            const content = 'function or(a, b) { return a || b; }';
            const wrapper = transpiler.transpile(content);
            wrapper.setFunctionName('or');

            expect(wrapper.call(true, true)).to.equal(1);
            expect(wrapper.call(true, false)).to.equal(1);
            expect(wrapper.call(false, true)).to.equal(1);
            expect(wrapper.call(false, false)).to.equal(0);
        });

        it('should handle multiple logical operators', () => {
            const content = 'function logic(a, b, c) { return a || b && c; }';
            const wrapper = transpiler.transpile(content);
            wrapper.setFunctionName('logic');

            expect(wrapper.call(true, true, true)).to.equal(1);
            expect(wrapper.call(true, true, false)).to.equal(1);
            expect(wrapper.call(true, false, true)).to.equal(1);
            expect(wrapper.call(true, false, false)).to.equal(1);
            expect(wrapper.call(false, true, true)).to.equal(1);
            expect(wrapper.call(false, true, false)).to.equal(0);
            expect(wrapper.call(false, false, true)).to.equal(0);
            expect(wrapper.call(false, false, false)).to.equal(0);
        });

        it('should handle expression statements', () => {
            const content = 'function add(a, b) { a + b; return a + b; }';
            const wrapper = transpiler.transpile(content);
            wrapper.setFunctionName('add');

            expect(wrapper.call(1, 2)).to.equal(3);
            expect(wrapper.call(10, 2)).to.equal(12);
            expect(wrapper.call(0, 123)).to.equal(123);
            expect(wrapper.call(123, 0)).to.equal(123);
            expect(wrapper.call(0, 0)).to.equal(0);
            expect(wrapper.call(-20, -5)).to.equal(-25);
        });
    });
});
