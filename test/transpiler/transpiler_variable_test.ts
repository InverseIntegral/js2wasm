import {expect} from 'chai';
import Transpiler from '../../src/transpiler';

describe('Transpiler', () => {
    describe('#transpile()', () => {

        it('should handle plus shorthand assignment', () => {
            const content = 'function plusAssign(a) { var b = 1; b += a; return b; }';
            const exports = Transpiler.transpile(content);

            expect(exports('plusAssign', 5)).to.equal(6);
            expect(exports('plusAssign', -5)).to.equal(-4);
        });

        it('should handle minus shorthand assignment', () => {
            const content = 'function minusAssign(a) { var b = 1; b -= a; return b; }';
            const exports = Transpiler.transpile(content);

            expect(exports('minusAssign', 5)).to.equal(-4);
            expect(exports('minusAssign', -5)).to.equal(6);
        });

        it('should handle multiplication shorthand assignment', () => {
            const content = 'function multAssign(a) { var b = 2; b *= a; return b; }';
            const exports = Transpiler.transpile(content);

            expect(exports('multAssign', 5)).to.equal(10);
            expect(exports('multAssign', -5)).to.equal(-10);
        });

        it('should handle division shorthand assignment', () => {
            const content = 'function divAssign(a) { var b = 10; b /= a; return b; }';
            const exports = Transpiler.transpile(content);

            expect(exports('divAssign', 5)).to.equal(2);
            expect(exports('divAssign', -5)).to.equal(-2);
        });

        it('should handle a single variable', () => {
            const exports = Transpiler.transpile('function variables(a) { var x; x = 10; return x; }');
            expect(exports('variables', 100)).to.equal(10);
        });

        it('should handle a single variable with direct assignment', () => {
            const exports = Transpiler.transpile('function variables() { var x = 10; return x; }');
            expect(exports('variables')).to.equal(10);
        });

        it('should handle multiple variables', () => {
            const content = 'function variables(a) { var x, y; x = 10; y = 20; return x * y; }';
            const exports = Transpiler.transpile(content);
            expect(exports('variables', 100)).to.equal(200);
        });

        it('should handle multiple variables with direct assignments', () => {
            const content = 'function variables(a) { var x = 10, y = 20; return x * y; }';
            const exports = Transpiler.transpile(content);
            expect(exports('variables', 100)).to.equal(200);
        });

        it('should handle variables within branches', () => {
            const content = 'function variables(a) { var x; if (a) { x = 10; } else { x = 20; } return x; }';
            const exports = Transpiler.transpile(content);
            expect(exports('variables', true)).to.equal(10);
            expect(exports('variables', false)).to.equal(20);
        });

        it('should hoist variable declarations', () => {
            const content = 'function variables(a) { x = 20; if (a) { var x; } return x; }';
            const exports = Transpiler.transpile(content);
            expect(exports('variables', true)).to.equal(20);
            expect(exports('variables', false)).to.equal(20);
        });

    });
});
