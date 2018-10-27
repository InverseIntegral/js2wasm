import {expect} from 'chai';
import Transpiler from '../../src/transpiler';

describe('Transpiler', () => {
    describe('#transpile()', () => {
        it('should handle numeric literals', () => {
            const exports = Transpiler.transpile('function answer() { return 42; }');
            expect(exports('answer')).to.equal(42);
        });

        it('should return correct boolean value', () => {
            const exports = Transpiler.transpile('function id(a) { return a; }');
            expect(exports('id', true)).to.equal(1);
            expect(exports('id', false)).to.equal(0);
        });

        it('should handle boolean literals', () => {
            const exports = Transpiler.transpile('function alwaysTrue() { return true; }');
            expect(exports('alwaysTrue')).to.equal(1);

            const exports2 = Transpiler.transpile('function alwaysFalse() { return false; }');
            expect(exports2('alwaysFalse')).to.equal(0);
        });
    });
});
