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
            const wrapper = transpiler
                .setSignature('answer', WebAssemblyType.INT_32)
                .transpile('function answer() { return 42; }');
            expect(wrapper.setFunctionName('answer').call()).to.equal(42);
        });

        it('should return correct boolean value', () => {
            const wrapper = transpiler
                .setSignature('id', WebAssemblyType.BOOLEAN, WebAssemblyType.BOOLEAN)
                .transpile('function id(a) { return a; }');
            wrapper.setFunctionName('id');

            expect(wrapper.call(true)).to.equal(1);
            expect(wrapper.call(false)).to.equal(0);
        });

        it('should handle boolean literals', () => {
            const wrapper = transpiler
                .setSignature('alwaysTrue', WebAssemblyType.BOOLEAN)
                .transpile('function alwaysTrue() { return true; }');
            expect(wrapper.setFunctionName('alwaysTrue').call()).to.equal(1);

            const wrapper2 = transpiler
                .setSignature('alwaysFalse', WebAssemblyType.BOOLEAN)
                .transpile('function alwaysFalse() { return false; }');
            expect(wrapper2.setFunctionName('alwaysFalse').call()).to.equal(0);
        });
    });
});
