import {expect} from 'chai';
import {WebAssemblyType} from '../../src/generator/wasm_type';
import Transpiler from '../../src/transpiler';

describe('Transpiler', () => {

    let transpiler: Transpiler;

    beforeEach(() => {
        transpiler = new Transpiler();
    });

    describe('#transpile()', () => {
        it('should check parameter amount', () => {
            const signatures = new Map();
            signatures.set('add', [WebAssemblyType.INT_32, WebAssemblyType.INT_32]);

            const wrapper = transpiler.transpile('function add(a, b) { return a + b; }', signatures);
            wrapper.setFunctionName('add');

            expect(() => wrapper.call(1, 2, 3)).to.throw();
            expect(() => wrapper.call(1, 2, 3, 4)).to.throw();
            expect(() => wrapper.call(1)).to.throw();
        });

        it('should check if the function name is set', () => {
            const signatures = new Map();
            signatures.set('add', [WebAssemblyType.INT_32, WebAssemblyType.INT_32]);

            const wrapper = transpiler.transpile('function add(a, b) { return a + b; }', signatures);

            expect(() => wrapper.call(1, 2)).to.throw();
            expect(() => wrapper.call(3, 4)).to.throw();
        });

        it('should check if the parameter types match the signature', () => {
            const signatures = new Map();
            signatures.set('add', [WebAssemblyType.INT_32, WebAssemblyType.INT_32]);
            signatures.set('and', [WebAssemblyType.BOOLEAN, WebAssemblyType.BOOLEAN]);
            signatures.set('length', [WebAssemblyType.INT_32_ARRAY]);

            const wrapper = transpiler.transpile('function add(a, b) { return a + b; }' +
                'function and(a, b) { return a && b; }' +
                'function length(array) { return array.length; }', signatures);

            wrapper.setFunctionName('add');
            expect(() => wrapper.call([], 2)).to.throw();
            expect(() => wrapper.call(true, 4)).to.throw();
            expect(() => wrapper.call(1.2, 4)).to.throw();
            expect(() => wrapper.call(NaN, 4)).to.throw();
            expect(() => wrapper.call(1, [1, 2, 3, 1.5])).to.throw();

            wrapper.setFunctionName('and');
            expect(() => wrapper.call(true, 1)).to.throw();
            expect(() => wrapper.call(0, false)).to.throw();
            expect(() => wrapper.call(true, 1.5)).to.throw();
            expect(() => wrapper.call(NaN, true)).to.throw();
            expect(() => wrapper.call(true, [true, false])).to.throw();

            wrapper.setFunctionName('length');
            expect(() => wrapper.call(true)).to.throw();
            expect(() => wrapper.call(false)).to.throw();
            expect(() => wrapper.call(1)).to.throw();
            expect(() => wrapper.call(1.5)).to.throw();
            expect(() => wrapper.call(NaN)).to.throw();
            expect(() => wrapper.call([1.4, 1])).to.throw();
            expect(() => wrapper.call([1, 2, 3, true])).to.throw();
        });
    });
});
