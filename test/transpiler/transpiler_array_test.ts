import {expect} from 'chai';
import Transpiler from '../../src/transpiler';

describe('Transpiler', () => {
    describe('#transpile()', () => {
        it('should handle array declaration', () => {
            const content = 'function func() { var array = [1, 2, 3]; return 0; }';
            const {func} = Transpiler.transpile(content);

            expect(func()).to.equal(0);
        });
    });
});
