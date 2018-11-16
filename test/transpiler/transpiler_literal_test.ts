import {expect} from 'chai';
import {WebAssemblyType} from '../../src/generator/wasm_type';
import Transpiler from '../../src/transpiler';

describe('Transpiler', () => {

    let transpiler: Transpiler;

    beforeEach(() => {
        transpiler = new Transpiler();
    });

    describe('#transpile()', () => {
        it('should handle numeric literals', () => {
            const type = new Map([['answer', []]]);
            const wrapper = transpiler.transpile('function answer() { return 42; }', type);
            expect(wrapper.setFunctionName('answer').call()).to.equal(42);
        });

        it('should return correct boolean value', () => {
            const type = new Map([['id', [WebAssemblyType.INT_32]]]);
            const wrapper = transpiler.transpile('function id(a) { return a; }', type);
            wrapper.setFunctionName('id');

            expect(wrapper.call(true)).to.equal(1);
            expect(wrapper.call(false)).to.equal(0);
        });

        it('should handle boolean literals', () => {
            const type = new Map([['alwaysTrue', []]]);
            const wrapper = transpiler.transpile('function alwaysTrue() { return true; }', type);
            expect(wrapper.setFunctionName('alwaysTrue').call()).to.equal(1);

            const type2 = new Map([['alwaysFalse', []]]);
            const wrapper2 = transpiler.transpile('function alwaysFalse() { return false; }', type2);
            expect(wrapper2.setFunctionName('alwaysFalse').call()).to.equal(0);
        });
    });
});
