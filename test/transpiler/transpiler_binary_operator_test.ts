import {expect} from 'chai';
import Transpiler from '../../src/transpiler';
import {createSingleIntegerOnlyFunction} from '../../src/generator/wasm_type';

describe('Transpiler', () => {
    describe('#transpile()', () => {
        it('should handle addition', () => {
            const content = 'function add(a, b) { return a + b; }';
            const {add} = Transpiler.transpile(content, createSingleIntegerOnlyFunction('add', 2));

            expect(add(1, 2)).to.equal(3);
            expect(add(100, 2)).to.equal(102);
            expect(add(-20, 20)).to.equal(0);
            expect(add(NaN, 2)).to.equal(2);
        });

        it('should handle subtraction', () => {
            const content = 'function sub(a, b) { return a - b; }';
            const {sub} = Transpiler.transpile(content, createSingleIntegerOnlyFunction('sub', 2));

            expect(sub(1, 2)).to.equal(-1);
            expect(sub(10, 2)).to.equal(8);
            expect(sub(-20, 20)).to.equal(-40);
            expect(sub(NaN, 2)).to.equal(-2);
        });

        it('should handle multiplication', () => {
            const content = 'function mul(a, b) { return a * b }';
            const {mul} = Transpiler.transpile(content, createSingleIntegerOnlyFunction('mul', 2));

            expect(mul(1, 2)).to.equal(2);
            expect(mul(10, 2)).to.equal(20);
            expect(mul(-10, 2)).to.equal(-20);
            expect(mul(NaN, 2)).to.equal(0);
        });

        it('should handle multiplication before addition', () => {
            const content = 'function mul(a, b, c) { return a + b * c }';
            const {mul} = Transpiler.transpile(content, createSingleIntegerOnlyFunction('mul', 3));

            expect(mul(3, 2, 5)).to.equal(13);
        });

        it('should handle multiplication before subtraction', () => {
            const content = 'function mul(a, b, c) { return a - b * c }';
            const {mul} = Transpiler.transpile(content, createSingleIntegerOnlyFunction('mul', 3));

            expect(mul(3, 2, 5)).to.equal(-7);
        });

        it('should handle division', () => {
            const content = 'function div(a, b) { return a / b }';
            const {div} = Transpiler.transpile(content, createSingleIntegerOnlyFunction('div', 2));

            expect(div(1, 2)).to.equal(0);
            expect(div(10, 2)).to.equal(5);
            expect(div(-10, 2)).to.equal(-5);
            expect(div(NaN, 2)).to.equal(0);
        });

        it('should handle division by 0', () => {
            const content = 'function div(a, b) { return a / b }';
            const {div} = Transpiler.transpile(content, createSingleIntegerOnlyFunction('div', 2));

            expect(() => div(2, 0)).to.throw();
            expect(() => div(2, NaN)).to.throw();
        });

        it('should handle division before addition', () => {
            const content = 'function div(a, b, c) { return a + b / c }';
            const {div} = Transpiler.transpile(content, createSingleIntegerOnlyFunction('div', 3));

            expect(div(3, 10, 5)).to.equal(5);
        });

        it('should handle division before subtraction', () => {
            const content = 'function div(a, b, c) { return a - b / c }';
            const {div} = Transpiler.transpile(content, createSingleIntegerOnlyFunction('div', 3));

            expect(div(3, 10, 5)).to.equal(1);
        });

        it('should handle modulo', () => {
            const content = 'function mod(a, b) { return a % b }';
            const {mod} = Transpiler.transpile(content, createSingleIntegerOnlyFunction('mod', 2));

            expect(mod(1, 2)).to.equal(1);
            expect(mod(10, 2)).to.equal(0);
            expect(mod(-10, 2)).to.equal(0);
            expect(mod(NaN, 2)).to.equal(0);
        });

        it('should handle modulo by 0', () => {
            const content = 'function mod(a, b) { return a % b }';
            const {mod} = Transpiler.transpile(content, createSingleIntegerOnlyFunction('mod', 2));

            expect(() => mod(2, 0)).to.throw();
            expect(() => mod(2, NaN)).to.throw();
        });

        it('should handle modulo before addition', () => {
            const content = 'function mod(a, b, c) { return a + b % c }';
            const {mod} = Transpiler.transpile(content, createSingleIntegerOnlyFunction('mod', 3));

            expect(mod(3, 10, 6)).to.equal(7);
        });

        it('should handle modulo before subtraction', () => {
            const content = 'function mod(a, b, c) { return a - b % c }';
            const {mod} = Transpiler.transpile(content, createSingleIntegerOnlyFunction('mod', 3));

            expect(mod(3, 10, 6)).to.equal(-1);
        });

        it('should handle equality', () => {
            const content = 'function eq(a, b) { return a == b }';
            const {eq} = Transpiler.transpile(content, createSingleIntegerOnlyFunction('eq', 2));

            expect(eq(3, 3)).to.equal(1);
            expect(eq(3, 2)).to.equal(0);
        });

        it('should handle inequality', () => {
            const content = 'function neq(a, b) { return a != b }';
            const {neq} = Transpiler.transpile(content, createSingleIntegerOnlyFunction('neq', 2));

            expect(neq(3, 2)).to.equal(1);
            expect(neq(3, 3)).to.equal(0);
        });

        it('should handle less than', () => {
            const content = 'function lt(a, b) { return a < b }';
            const {lt} = Transpiler.transpile(content, createSingleIntegerOnlyFunction('lt', 2));

            expect(lt(3, 2)).to.equal(0);
            expect(lt(3, 3)).to.equal(0);
            expect(lt(3, 4)).to.equal(1);
            expect(lt(-3, -4)).to.equal(0);
            expect(lt(-4, -3)).to.equal(1);
        });

        it('should handle less than or equal to', () => {
            const content = 'function le(a, b) { return a <= b }';
            const {le} = Transpiler.transpile(content, createSingleIntegerOnlyFunction('le', 2));

            expect(le(3, 2)).to.equal(0);
            expect(le(3, 3)).to.equal(1);
            expect(le(3, 4)).to.equal(1);
            expect(le(-3, -4)).to.equal(0);
            expect(le(-4, -3)).to.equal(1);
        });

        it('should handle greater than', () => {
            const content = 'function gt(a, b) { return a > b }';
            const {gt} = Transpiler.transpile(content, createSingleIntegerOnlyFunction('gt', 2));

            expect(gt(3, 2)).to.equal(1);
            expect(gt(3, 3)).to.equal(0);
            expect(gt(3, 4)).to.equal(0);
            expect(gt(-3, -4)).to.equal(1);
            expect(gt(-4, -3)).to.equal(0);
        });

        it('should handle greater than or equal to', () => {
            const content = 'function ge(a, b) { return a >= b }';
            const {ge} = Transpiler.transpile(content, createSingleIntegerOnlyFunction('ge', 2));

            expect(ge(3, 2)).to.equal(1);
            expect(ge(3, 3)).to.equal(1);
            expect(ge(3, 4)).to.equal(0);
            expect(ge(-3, -4)).to.equal(1);
            expect(ge(-4, -3)).to.equal(0);
        });

        it('should handle parenthesis', () => {
            const content = 'function sub(a, b) { return (a + 3) - (b + 2); }';
            const {sub} = Transpiler.transpile(content, createSingleIntegerOnlyFunction('sub', 2));
            expect(sub(10, 2)).to.equal(9);
        });

        it('should handle logical and', () => {
            const content = 'function and(a, b) { return a && b; }';
            const {and} = Transpiler.transpile(content, createSingleIntegerOnlyFunction('and', 2));

            expect(and(true, true)).to.equal(1);
            expect(and(true, false)).to.equal(0);
            expect(and(false, true)).to.equal(0);
            expect(and(false, false)).to.equal(0);
        });

        it('should handle logical or', () => {
            const content = 'function or(a, b) { return a || b; }';
            const {or} = Transpiler.transpile(content, createSingleIntegerOnlyFunction('or', 2));

            expect(or(true, true)).to.equal(1);
            expect(or(true, false)).to.equal(1);
            expect(or(false, true)).to.equal(1);
            expect(or(false, false)).to.equal(0);
        });

        it('should handle multiple logical operators', () => {
            const content = 'function logic(a, b, c) { return a || b && c; }';
            const {logic} = Transpiler.transpile(content, createSingleIntegerOnlyFunction('logic', 3));

            expect(logic(true, true, true)).to.equal(1);
            expect(logic(true, true, false)).to.equal(1);
            expect(logic(true, false, true)).to.equal(1);
            expect(logic(true, false, false)).to.equal(1);
            expect(logic(false, true, true)).to.equal(1);
            expect(logic(false, true, false)).to.equal(0);
            expect(logic(false, false, true)).to.equal(0);
            expect(logic(false, false, false)).to.equal(0);
        });

        it('should handle expression statements', () => {
            const content = 'function add(a, b) { a + b; return a + b; }';
            const {add} = Transpiler.transpile(content, createSingleIntegerOnlyFunction('add', 2));

            expect(add(1, 2)).to.equal(3);
            expect(add(10, 2)).to.equal(12);
            expect(add(0, 123)).to.equal(123);
            expect(add(123, 0)).to.equal(123);
            expect(add(0, 0)).to.equal(0);
            expect(add(-20, -5)).to.equal(-25);
        });
    });
});
