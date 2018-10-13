import {expect} from 'chai';
import Transpiler from '../src/transpiler';

describe('Transpiler', () => {
    describe('#transpile()', () => {
        it('should handle unary plus', () => {
            const {func} = Transpiler.transpile('function func(a) { return +a + +40; }');

            expect(func(2)).to.equal(42);
            expect(func(-2)).to.equal(38);
        });

        it('should handle unary minus', () => {
            const {func} = Transpiler.transpile('function func(a) { return -a + -40; }');

            expect(func(2)).to.equal(-42);
            expect(func(-2)).to.equal(-38);
        });

        it('should handle multiple consecutive unary operators', () => {
            const {func} = Transpiler.transpile('function func(a) { return a + -+-+-40; }');

            expect(func(2)).to.equal(-38);
        });

        it('should handle unary not', () => {
            const {func} = Transpiler.transpile('function func(a) { return !a; }');

            expect(func(true)).to.equal(0);
            expect(func(false)).to.equal(1);
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

        it('should handle less than', () => {
            const {lt} = Transpiler.transpile('function lt(a, b) { return a < b }');

            expect(lt(3, 2)).to.equal(0);
            expect(lt(3, 3)).to.equal(0);
            expect(lt(3, 4)).to.equal(1);
            expect(lt(-3, -4)).to.equal(0);
            expect(lt(-4, -3)).to.equal(1);
        });

        it('should handle less than or equal to', () => {
            const {le} = Transpiler.transpile('function le(a, b) { return a <= b }');

            expect(le(3, 2)).to.equal(0);
            expect(le(3, 3)).to.equal(1);
            expect(le(3, 4)).to.equal(1);
            expect(le(-3, -4)).to.equal(0);
            expect(le(-4, -3)).to.equal(1);
        });

        it('should handle greater than', () => {
            const {gt} = Transpiler.transpile('function gt(a, b) { return a > b }');

            expect(gt(3, 2)).to.equal(1);
            expect(gt(3, 3)).to.equal(0);
            expect(gt(3, 4)).to.equal(0);
            expect(gt(-3, -4)).to.equal(1);
            expect(gt(-4, -3)).to.equal(0);
        });

        it('should handle greater than or equal to', () => {
            const {ge} = Transpiler.transpile('function ge(a, b) { return a >= b }');

            expect(ge(3, 2)).to.equal(1);
            expect(ge(3, 3)).to.equal(1);
            expect(ge(3, 4)).to.equal(0);
            expect(ge(-3, -4)).to.equal(1);
            expect(ge(-4, -3)).to.equal(0);
        });

        it('should handle numeric literals', () => {
            const {answer} = Transpiler.transpile('function answer() { return 42; }');
            expect(answer()).to.equal(42);
        });

        it('should return correct boolean value', () => {
            const {id} = Transpiler.transpile('function id(a) { return a; }');
            expect(id(true)).to.equal(1);
            expect(id(false)).to.equal(0);
        });

        it('should handle parenthesis', () => {
            const {sub} = Transpiler.transpile('function sub(a, b) { return (a + 3) - (b + 2); }');
            expect(sub(10, 2)).to.equal(9);
        });

        it('should handle boolean literals', () => {
            const {alwaysTrue} = Transpiler.transpile('function alwaysTrue() { return true; }');
            expect(alwaysTrue()).to.equal(1);

            const {alwaysFalse} = Transpiler.transpile('function alwaysFalse() { return false; }');
            expect(alwaysFalse()).to.equal(0);
        });

        it('should handle if else statements', () => {
            const content = 'function alwaysOne() { if (false) { return 100; } else { return 1; } }';
            const {alwaysOne} = Transpiler.transpile(content);
            expect(alwaysOne()).to.equal(1);
        });

        it('should handle if statements without else part', () => {
            const content = 'function alwaysOne() { if (false) { return 100; } return 1; }';
            const {alwaysOne} = Transpiler.transpile(content);
            expect(alwaysOne()).to.equal(1);

            const content2 = 'function alwaysTwo() { if (true) { return 2; } return 1; }';
            const {alwaysTwo} = Transpiler.transpile(content2);
            expect(alwaysTwo()).to.equal(2);
        });

        it('should handle else if statements', () => {
            const content = 'function elseIf(a, b) { if (a) { return 0; } else if (b) { return 1; } return 2; }';
            const {elseIf} = Transpiler.transpile(content);

            expect(elseIf(true, false)).to.equal(0);
            expect(elseIf(true, true)).to.equal(0);
            expect(elseIf(false, true)).to.equal(1);
            expect(elseIf(false, false)).to.equal(2);
        });

        it('should handle multiple else if statements', () => {
            const content = 'function elseIf(a, b, c) { ' +
                'if (a) { return 0; } ' +
                'else if (b) { return 1; } ' +
                'else if(c) { return 2; } ' +
                'else { return 3; } }';
            const {elseIf} = Transpiler.transpile(content);

            expect(elseIf(true, true, true)).to.equal(0);
            expect(elseIf(true, true, false)).to.equal(0);
            expect(elseIf(true, false, true)).to.equal(0);
            expect(elseIf(true, false, false)).to.equal(0);
            expect(elseIf(false, true, true)).to.equal(1);
            expect(elseIf(false, true, false)).to.equal(1);
            expect(elseIf(false, false, true)).to.equal(2);
            expect(elseIf(false, false, false)).to.equal(3);
        });

        it('should handle logical and', () => {
            const content = 'function and(a, b) { return a && b; }';
            const {and} = Transpiler.transpile(content);

            expect(and(true, true)).to.equal(1);
            expect(and(true, false)).to.equal(0);
            expect(and(false, true)).to.equal(0);
            expect(and(false, false)).to.equal(0);
        });

        it('should handle logical or', () => {
            const content = 'function or(a, b) { return a || b; }';
            const {or} = Transpiler.transpile(content);

            expect(or(true, true)).to.equal(1);
            expect(or(true, false)).to.equal(1);
            expect(or(false, true)).to.equal(1);
            expect(or(false, false)).to.equal(0);
        });

        it('should handle multiple logical operators', () => {
            const content = 'function logic(a, b, c) { return a || b && c; }';
            const {logic} = Transpiler.transpile(content);

            expect(logic(false, true, true)).to.equal(1);
            expect(logic(false, true, false)).to.equal(0);
            expect(logic(false, false, true)).to.equal(0);
            expect(logic(true, false, false)).to.equal(1);
        });

        it('should handle logical operators in if statement', () => {
            const content = 'function elseIf(a, b) {' +
                'if (a && b) { return 0; }' +
                'else if (a || b) { return 1; }' +
                'else { return 2; } }';
            const {elseIf} = Transpiler.transpile(content);

            expect(elseIf(true, true)).to.equal(0);
            expect(elseIf(true, false)).to.equal(1);
            expect(elseIf(false, true)).to.equal(1);
            expect(elseIf(false, false)).to.equal(2);
        });
    });
});
