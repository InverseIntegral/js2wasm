import {expect} from 'chai';
import Transpiler from '../../src/transpiler';

describe('Transpiler', () => {
    describe('#transpile()', () => {

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
