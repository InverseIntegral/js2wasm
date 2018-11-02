import {expect} from 'chai';
import {Transpiler} from '../../src/transpiler';

describe('Transpiler', () => {
    describe('#transpile()', () => {
        it('should handle simple while', () => {
            const content = 'function loop(value, times) { ' +
                'var i = 0;' +
                'while (i < times) { value += 1; i++; }' +
                'return value; }';
            const exports = Transpiler.transpile(content);

            expect(exports('loop', 10, 5)).to.equal(15);
            expect(exports('loop', -10, 5)).to.equal(-5);
            expect(exports('loop', 10, 0)).to.equal(10);
            expect(exports('loop', 10, -1)).to.equal(10);
        });

        it('should handle nested while', () => {
            const content = 'function loop(value, times) { ' +
                'var i = 0, x = 0;' +
                'while (i < times) { ' +
                    'while (x < times) { value += 1; x++; }' +
                'x = 0; i++; }' +
                'return value; }';
            const exports = Transpiler.transpile(content);

            expect(exports('loop', 10, 5)).to.equal(35);
            expect(exports('loop', -10, 5)).to.equal(15);
            expect(exports('loop', 10, 0)).to.equal(10);
            expect(exports('loop', 10, -1)).to.equal(10);
        });

        it('should handle multiple while', () => {
            const content = 'function loop(value, times) { ' +
                'var i = 0;' +
                'while (i < times) { value += 1; i++; }' +
                'i = 0;' +
                'while (i < times) { value += 1; i++; }' +
                'return value; }';
            const exports = Transpiler.transpile(content);

            expect(exports('loop', 10, 5)).to.equal(20);
            expect(exports('loop', -10, 5)).to.equal(0);
            expect(exports('loop', 10, 0)).to.equal(10);
            expect(exports('loop', 10, -1)).to.equal(10);
        });

        it('should handle while in if', () => {
            const content = 'function loop(value, times) { ' +
                'var i = 0;' +
                'if (value >= 0) { while (i < times) { value += 1; i++; } }' +
                'return value; }';
            const exports = Transpiler.transpile(content);

            expect(exports('loop', 10, 5)).to.equal(15);
            expect(exports('loop', -10, 5)).to.equal(-10);
            expect(exports('loop', 10, 0)).to.equal(10);
            expect(exports('loop', 10, -1)).to.equal(10);
        });

        it('should handle if in while', () => {
            const content = 'function loop(value, times) { ' +
                'var i = 0;' +
                'while (i < times) { if (value >= 0) { value += 1; } i++; }' +
                'return value; }';
            const exports = Transpiler.transpile(content);

            expect(exports('loop', 10, 5)).to.equal(15);
            expect(exports('loop', -10, 5)).to.equal(-10);
            expect(exports('loop', 10, 0)).to.equal(10);
            expect(exports('loop', 10, -1)).to.equal(10);
        });

        it('should handle else-if in while', () => {
            const content = 'function loop(value, times) { ' +
                'var i = 0;' +
                'while (i < times) { ' +
                    'if (value >= 0) { value += 1; }' +
                    'else if (value >= -10) { value += 2; }' +
                    'else { value += 4; }' +
                'i++; }' +
                'return value; }';
            const exports = Transpiler.transpile(content);

            expect(exports('loop', 10, 5)).to.equal(15);
            expect(exports('loop', -10, 5)).to.equal(0);
            expect(exports('loop', -20, 5)).to.equal(-4);
            expect(exports('loop', 10, 0)).to.equal(10);
            expect(exports('loop', 10, -1)).to.equal(10);
        });

        it('should handle while loops without braces', () => {
            const content = 'function loop(times) { ' +
                'var i = 0;' +
                'while (i < times) i++;' +
                'return i; }';
            const exports = Transpiler.transpile(content);

            expect(exports('loop', 5)).to.equal(5);
            expect(exports('loop', 0)).to.equal(0);
            expect(exports('loop', -1)).to.equal(0);
        });
    });
});
