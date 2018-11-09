import {expect} from 'chai';
import Transpiler from '../../src/transpiler';

describe('Transpiler', () => {

    let transpiler: Transpiler;

    beforeEach(() => {
        transpiler = new Transpiler();
    });

    describe('#transpile()', () => {
        it('should not work on non-functions', () => {
            expect(() => transpiler.transpile('1 + 2;')).to.throw();
        });

        it('should handle function calls', () => {
            const content = 'function id(a) { return a; }' +
                'function add(a, b) { return id(a) + id(b); }';
            const exports = transpiler.transpile(content);

            expect(exports.setFunctionName('add').call(1, 2)).to.equal(3);
        });

        it('should handle recursive function calls', () => {
            const content = 'function fibonacci(current) { ' +
                'if (current <= 2) { return 1; } ' +
                'return fibonacci(current - 2) + fibonacci(current - 1); } ';
            const exports = transpiler.transpile(content);
            exports.setFunctionName('fibonacci');

            expect(exports.call(6)).to.equal(8);
            expect(exports.call(12)).to.equal(144);
        });

        it('should handle multiple function calls', () => {
            const content = 'function incr(current) { return current + 1; }' +
                'function double(current) { return 2 * current; }' +
                'function complete(current) {return double(incr(current)); } ';
            const exports = transpiler.transpile(content);
            exports.setFunctionName('incr');

            expect(exports.call(3)).to.equal(4);
            expect(exports.call(-100)).to.equal(-99);
            expect(exports.call(20)).to.equal(21);

            exports.setFunctionName('double');

            expect(exports.call(20)).to.equal(40);
            expect(exports.call(0)).to.equal(0);
            expect(exports.call(-10)).to.equal(-20);

            exports.setFunctionName('complete');

            expect(exports.call(2)).to.equal(6);
            expect(exports.call(-2)).to.equal(-2);
        });

        it('should handle function calls without assignments', () => {
            const content = 'function double(current) { return 2 * current; }' +
                'function complete(current) { double(current); return double(current); } ';
            const exports = transpiler.transpile(content);
            exports.setFunctionName('complete');

            expect(exports.call(2)).to.equal(4);
            expect(exports.call(-2)).to.equal(-4);
        });
    });
});
