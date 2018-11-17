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
    });
});
