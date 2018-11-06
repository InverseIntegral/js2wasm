import {expect} from 'chai';
import Transpiler from '../../src/transpiler';

describe('Transpiler', () => {

    let transpiler: Transpiler;

    beforeEach(() => {
        transpiler = new Transpiler();
    });

    describe('#transpile()', () => {
        it('should handle numeric literals', () => {
            const exports = transpiler.transpile('function answer() { return 42; }');
            expect(exports.run('answer')).to.equal(42);
        });

        it('should return correct boolean value', () => {
            const exports = transpiler.transpile('function id(a) { return a; }');
            expect(exports.run('id', true)).to.equal(1);
            expect(exports.run('id', false)).to.equal(0);
        });

        it('should handle boolean literals', () => {
            const exports = transpiler.transpile('function alwaysTrue() { return true; }');
            expect(exports.run('alwaysTrue')).to.equal(1);

            const exports2 = transpiler.transpile('function alwaysFalse() { return false; }');
            expect(exports2.run('alwaysFalse')).to.equal(0);
        });
    });
});
