import {expect} from 'chai';
import Transpiler from '../../src/transpiler';

describe('Transpiler', () => {
    describe('#transpile()', () => {
        it('should handle addition', () => {
            const add = Transpiler.transpile('function add(a, b) { return a + b; }');

            expect(add('add', 1, 2)).to.equal(3);
            expect(add('add', 100, 2)).to.equal(102);
            expect(add('add', -20, 20)).to.equal(0);
            expect(add('add', NaN, 2)).to.equal(2);
        });

        it('should handle subtraction', () => {
            const sub = Transpiler.transpile('function sub(a, b) { return a - b; }');

            expect(sub('sub', 1, 2)).to.equal(-1);
            expect(sub('sub', 10, 2)).to.equal(8);
            expect(sub('sub', -20, 20)).to.equal(-40);
            expect(sub('sub', NaN, 2)).to.equal(-2);
        });

        it('should handle multiplication', () => {
            const mul = Transpiler.transpile('function mul(a, b) { return a * b }');

            expect(mul('mul', 1, 2)).to.equal(2);
            expect(mul('mul', 10, 2)).to.equal(20);
            expect(mul('mul', -10, 2)).to.equal(-20);
            expect(mul('mul', NaN, 2)).to.equal(0);
        });

        it('should handle multiplication before addition', () => {
            const mul = Transpiler.transpile('function mul(a, b, c) { return a + b * c }');

            expect(mul('mul', 3, 2, 5)).to.equal(13);
        });

        it('should handle multiplication before subtraction', () => {
            const mul = Transpiler.transpile('function mul(a, b, c) { return a - b * c }');

            expect(mul('mul', 3, 2, 5)).to.equal(-7);
        });

        it('should handle division', () => {
            const div = Transpiler.transpile('function div(a, b) { return a / b }');

            expect(div('div', 1, 2)).to.equal(0);
            expect(div('div', 10, 2)).to.equal(5);
            expect(div('div', -10, 2)).to.equal(-5);
            expect(div('div', NaN, 2)).to.equal(0);
        });

        it('should handle division by 0', () => {
            const div = Transpiler.transpile('function div(a, b) { return a / b }');

            expect(() => div('div', 2, 0)).to.throw();
            expect(() => div('div', 2, NaN)).to.throw();
        });

        it('should handle division before addition', () => {
            const div = Transpiler.transpile('function div(a, b, c) { return a + b / c }');

            expect(div('div', 3, 10, 5)).to.equal(5);
        });

        it('should handle division before subtraction', () => {
            const div = Transpiler.transpile('function div(a, b, c) { return a - b / c }');

            expect(div('div', 3, 10, 5)).to.equal(1);
        });

        it('should handle modulo', () => {
            const mod = Transpiler.transpile('function mod(a, b) { return a % b }');

            expect(mod('mod', 1, 2)).to.equal(1);
            expect(mod('mod', 10, 2)).to.equal(0);
            expect(mod('mod', -10, 2)).to.equal(0);
            expect(mod('mod', NaN, 2)).to.equal(0);
        });

        it('should handle modulo by 0', () => {
            const mod = Transpiler.transpile('function mod(a, b) { return a % b }');

            expect(() => mod('mod', 2, 0)).to.throw();
            expect(() => mod('mod', 2, NaN)).to.throw();
        });

        it('should handle modulo before addition', () => {
            const mod = Transpiler.transpile('function mod(a, b, c) { return a + b % c }');

            expect(mod('mod', 3, 10, 6)).to.equal(7);
        });

        it('should handle modulo before subtraction', () => {
            const mod = Transpiler.transpile('function mod(a, b, c) { return a - b % c }');

            expect(mod('mod', 3, 10, 6)).to.equal(-1);
        });

        it('should handle equality', () => {
            const eq = Transpiler.transpile('function eq(a, b) { return a == b }');

            expect(eq('eq', 3, 3)).to.equal(1);
            expect(eq('eq', 3, 2)).to.equal(0);
        });

        it('should handle inequality', () => {
            const neq = Transpiler.transpile('function neq(a, b) { return a != b }');

            expect(neq('neq', 3, 2)).to.equal(1);
            expect(neq('neq', 3, 3)).to.equal(0);
        });

        it('should handle less than', () => {
            const lt = Transpiler.transpile('function lt(a, b) { return a < b }');

            expect(lt('lt', 3, 2)).to.equal(0);
            expect(lt('lt', 3, 3)).to.equal(0);
            expect(lt('lt', 3, 4)).to.equal(1);
            expect(lt('lt', -3, -4)).to.equal(0);
            expect(lt('lt', -4, -3)).to.equal(1);
        });

        it('should handle less than or equal to', () => {
            const le = Transpiler.transpile('function le(a, b) { return a <= b }');

            expect(le('le', 3, 2)).to.equal(0);
            expect(le('le', 3, 3)).to.equal(1);
            expect(le('le', 3, 4)).to.equal(1);
            expect(le('le', -3, -4)).to.equal(0);
            expect(le('le', -4, -3)).to.equal(1);
        });

        it('should handle greater than', () => {
            const gt = Transpiler.transpile('function gt(a, b) { return a > b }');

            expect(gt('gt', 3, 2)).to.equal(1);
            expect(gt('gt', 3, 3)).to.equal(0);
            expect(gt('gt', 3, 4)).to.equal(0);
            expect(gt('gt', -3, -4)).to.equal(1);
            expect(gt('gt', -4, -3)).to.equal(0);
        });

        it('should handle greater than or equal to', () => {
            const ge = Transpiler.transpile('function ge(a, b) { return a >= b }');

            expect(ge('ge', 3, 2)).to.equal(1);
            expect(ge('ge', 3, 3)).to.equal(1);
            expect(ge('ge', 3, 4)).to.equal(0);
            expect(ge('ge', -3, -4)).to.equal(1);
            expect(ge('ge', -4, -3)).to.equal(0);
        });

        it('should handle parenthesis', () => {
            const sub = Transpiler.transpile('function sub(a, b) { return (a + 3) - (b + 2); }');
            expect(sub('sub', 10, 2)).to.equal(9);
        });

        it('should handle logical and', () => {
            const content = 'function and(a, b) { return a && b; }';
            const and = Transpiler.transpile(content);

            expect(and('and', true, true)).to.equal(1);
            expect(and('and', true, false)).to.equal(0);
            expect(and('and', false, true)).to.equal(0);
            expect(and('and', false, false)).to.equal(0);
        });

        it('should handle logical or', () => {
            const content = 'function or(a, b) { return a || b; }';
            const or = Transpiler.transpile(content);

            expect(or('or', true, true)).to.equal(1);
            expect(or('or', true, false)).to.equal(1);
            expect(or('or', false, true)).to.equal(1);
            expect(or('or', false, false)).to.equal(0);
        });

        it('should handle multiple logical operators', () => {
            const content = 'function logic(a, b, c) { return a || b && c; }';
            const logic = Transpiler.transpile(content);

            expect(logic('logic', true, true, true)).to.equal(1);
            expect(logic('logic', true, true, false)).to.equal(1);
            expect(logic('logic', true, false, true)).to.equal(1);
            expect(logic('logic', true, false, false)).to.equal(1);
            expect(logic('logic', false, true, true)).to.equal(1);
            expect(logic('logic', false, true, false)).to.equal(0);
            expect(logic('logic', false, false, true)).to.equal(0);
            expect(logic('logic', false, false, false)).to.equal(0);
        });

        it('should handle expression statements', () => {
            const content = 'function add(a, b) { a + b; return a + b; }';
            const add = Transpiler.transpile(content);

            expect(add('add', 1, 2)).to.equal(3);
            expect(add('add', 10, 2)).to.equal(12);
            expect(add('add', 0, 123)).to.equal(123);
            expect(add('add', 123, 0)).to.equal(123);
            expect(add('add', 0, 0)).to.equal(0);
            expect(add('add', -20, -5)).to.equal(-25);
        });
    });
});
