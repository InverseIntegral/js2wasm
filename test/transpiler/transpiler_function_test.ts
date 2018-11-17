import {expect} from 'chai';
import {WebAssemblyType} from '../../src/generator/wasm_type';
import Transpiler from '../../src/transpiler';

describe('Transpiler', () => {

    let transpiler: Transpiler;

    beforeEach(() => {
        transpiler = new Transpiler();
    });

    describe('#transpile()', () => {
        it('should not work on non-functions', () => {
            expect(() => transpiler.transpile('1 + 2;', new Map())).to.throw();
        });

        it('should handle function calls', () => {
            const types = new Map();
            types.set('add', [WebAssemblyType.INT_32, WebAssemblyType.INT_32]);
            types.set('id', [WebAssemblyType.INT_32]);

            const content = 'function id(a) { return a; }' +
                'function add(a, b) { return id(a) + id(b); }';
            const wrapper = transpiler.transpile(content, types);

            expect(wrapper.setFunctionName('add').call(1, 2)).to.equal(3);
        });

        it('should handle recursive function calls', () => {
            const type = new Map([['fibonacci', [WebAssemblyType.INT_32]]]);
            const content = 'function fibonacci(current) { ' +
                'if (current <= 2) { return 1; } ' +
                'return fibonacci(current - 2) + fibonacci(current - 1); } ';

            const wrapper = transpiler.transpile(content, type);
            wrapper.setFunctionName('fibonacci');

            expect(wrapper.call(6)).to.equal(8);
            expect(wrapper.call(12)).to.equal(144);
        });

        it('should handle multiple function calls', () => {
            const types = new Map();
            types.set('incr', [WebAssemblyType.INT_32]);
            types.set('double', [WebAssemblyType.INT_32]);
            types.set('complete', [WebAssemblyType.INT_32]);

            const content = 'function incr(current) { return current + 1; }' +
                'function double(current) { return 2 * current; }' +
                'function complete(current) {return double(incr(current)); } ';

            const wrapper = transpiler.transpile(content, types);
            wrapper.setFunctionName('incr');

            expect(wrapper.call(3)).to.equal(4);
            expect(wrapper.call(-100)).to.equal(-99);
            expect(wrapper.call(20)).to.equal(21);

            wrapper.setFunctionName('double');

            expect(wrapper.call(20)).to.equal(40);
            expect(wrapper.call(0)).to.equal(0);
            expect(wrapper.call(-10)).to.equal(-20);

            wrapper.setFunctionName('complete');

            expect(wrapper.call(2)).to.equal(6);
            expect(wrapper.call(-2)).to.equal(-2);
        });

        it('should handle function calls without assignments', () => {
            const types = new Map();
            types.set('double', [WebAssemblyType.INT_32]);
            types.set('complete', [WebAssemblyType.INT_32]);

            const content = 'function double(current) { return 2 * current; }' +
                'function complete(current) { double(current); return double(current); } ';

            const wrapper = transpiler.transpile(content, types);
            wrapper.setFunctionName('complete');

            expect(wrapper.call(2)).to.equal(4);
            expect(wrapper.call(-2)).to.equal(-4);
        });
    });
});
