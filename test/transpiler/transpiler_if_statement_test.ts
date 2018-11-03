import {expect} from 'chai';
import {Transpiler} from '../../src/transpiler';

describe('Transpiler', () => {

    let transpiler: Transpiler;

    beforeEach(() => {
        transpiler = new Transpiler();
    });

    describe('#transpile()', () => {

        it('should handle if else statements', () => {
            const content = 'function alwaysOne() { if (false) { return 100; } else { return 1; } }';
            const exports = transpiler.transpile(content);
            expect(exports('alwaysOne')).to.equal(1);
        });

        it('should handle if statements without else part', () => {
            const content = 'function alwaysOne() { if (false) { return 100; } return 1; }';
            const exports = transpiler.transpile(content);
            expect(exports('alwaysOne')).to.equal(1);

            const content2 = 'function alwaysTwo() { if (true) { return 2; } return 1; }';
            const exports2 = transpiler.transpile(content2);
            expect(exports2('alwaysTwo')).to.equal(2);
        });

        it('should handle else if statements', () => {
            const content = 'function elseIf(a, b) { if (a) { return 0; } else if (b) { return 1; } return 2; }';
            const exports = transpiler.transpile(content);

            expect(exports('elseIf', true, false)).to.equal(0);
            expect(exports('elseIf', true, true)).to.equal(0);
            expect(exports('elseIf', false, true)).to.equal(1);
            expect(exports('elseIf', false, false)).to.equal(2);
        });

        it('should handle multiple else if statements', () => {
            const content = 'function elseIf(a, b, c) { ' +
                'if (a) { return 0; } ' +
                'else if (b) { return 1; } ' +
                'else if (c) { return 2; } ' +
                'else { return 3; } }';
            const exports = transpiler.transpile(content);

            expect(exports('elseIf', true, true, true)).to.equal(0);
            expect(exports('elseIf', true, true, false)).to.equal(0);
            expect(exports('elseIf', true, false, true)).to.equal(0);
            expect(exports('elseIf', true, false, false)).to.equal(0);
            expect(exports('elseIf', false, true, true)).to.equal(1);
            expect(exports('elseIf', false, true, false)).to.equal(1);
            expect(exports('elseIf', false, false, true)).to.equal(2);
            expect(exports('elseIf', false, false, false)).to.equal(3);
        });

        it('should handle logical operators in if statement', () => {
            const content = 'function elseIf(a, b) {' +
                'if (a && b) { return 0; }' +
                'else if (a || b) { return 1; }' +
                'else { return 2; } }';
            const exports = transpiler.transpile(content);

            expect(exports('elseIf', true, true)).to.equal(0);
            expect(exports('elseIf', true, false)).to.equal(1);
            expect(exports('elseIf', false, true)).to.equal(1);
            expect(exports('elseIf', false, false)).to.equal(2);
        });
        it('should handle if with multiple statements', () => {
            const content = 'function elseIf(a, b, value) { ' +
                'if (a) { value += 1; return value; } ' +
                'else if (b) { value += 2; return value; } ' +
                'else { value += 3; return value; } }';
            const exports = transpiler.transpile(content);

            expect(exports('elseIf', true, false, 1)).to.equal(2);
            expect(exports('elseIf', false, true, 1)).to.equal(3);
            expect(exports('elseIf', false, false, 1)).to.equal(4);
        });

        it('should handle if statements without braces', () => {
            const content = 'function ifWithout(a) { if (a) return 10; else return 20; }';
            const exports = transpiler.transpile(content);

            expect(exports('ifWithout', true)).to.equal(10);
            expect(exports('ifWithout', false)).to.equal(20);
        });

        it('should handle else if statements without braces', () => {
            const content = 'function ifWithout(a, b) { if (a) return 10; else if(b) return 20; else return 30; }';
            const exports = transpiler.transpile(content);

            expect(exports('ifWithout', true, false)).to.equal(10);
            expect(exports('ifWithout', false, true)).to.equal(20);
            expect(exports('ifWithout', false, false)).to.equal(30);
        });
    });
});
