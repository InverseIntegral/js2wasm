import {expect} from 'chai';
import {WebAssemblyType} from '../../src/generator/wasm_type';
import Transpiler from '../../src/transpiler';

describe('Transpiler', () => {

    let transpiler: Transpiler;

    beforeEach(() => {
        transpiler = new Transpiler();
    });

    describe('#transpile()', () => {
        it('should handle double return value', () => {
            const wrapper = transpiler
                .setSignature('double', WebAssemblyType.FLOAT_64)
                .transpile('function double() { return 1.34; } ');

            expect(wrapper.setFunctionName('double').call()).to.equal(1.34);
        });
    });
});
