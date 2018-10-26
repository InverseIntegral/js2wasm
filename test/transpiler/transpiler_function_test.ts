import {expect} from 'chai';
import Transpiler from '../../src/transpiler';

describe('Transpiler', () => {
    describe('#transpile()', () => {
        it('should not work on non-functions', () => {
            expect(() => Transpiler.transpile('1 + 2;')).to.throw();
        });

        it('should handle function calls', () => {
            const content = 'function id(a) { return a; }' +
                'function add(a, b) { return id(a) + id(b); }';
            const add = Transpiler.transpile(content);

            expect(add('add', 1, 2)).to.equal(3);
        });

        it('should handle recursive function calls', () => {
            const content = 'function fibonacci(current) { ' +
                'if (current <= 2) { return 1; } ' +
                'return fibonacci(current - 2) + fibonacci(current - 1); } ';
            const fibonacci = Transpiler.transpile(content);

            expect(fibonacci('fibonacci', 6)).to.equal(8);
            expect(fibonacci('fibonacci', 12)).to.equal(144);
        });

        it('should handle multiple function calls', () => {
            const content = 'function incr(current) { return current + 1; }' +
                'function double(current) { return 2 * current; }' +
                'function complete(current) {return double(incr(current)); } ';
            const func = Transpiler.transpile(content);

            expect(func('incr', 3)).to.equal(4);
            expect(func('incr', -100)).to.equal(-99);
            expect(func('incr', 20)).to.equal(21);

            expect(func('double', 20)).to.equal(40);
            expect(func('double', 0)).to.equal(0);
            expect(func('double', -10)).to.equal(-20);

            expect(func('complete', 2)).to.equal(6);
            expect(func('complete', -2)).to.equal(-2);
        });

        it('should handle function calls without assignments', () => {
            const content = 'function double(current) { return 2 * current; }' +
                'function complete(current) { double(current); return double(current); } ';
            const complete = Transpiler.transpile(content);

            expect(complete('complete', 2)).to.equal(4);
            expect(complete('complete', -2)).to.equal(-4);
        });
    });
});
