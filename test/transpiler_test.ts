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
            const content = 'function elseIf(a, b) { if (a) { return 0; } else if (b) { return 1;} return 2; }';
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
    });
});
