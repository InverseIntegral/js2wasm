import {expect} from 'chai';
import Transpiler from '../../src/transpiler';

describe('Transpiler', () => {
    describe('#transpile()', () => {
        it('should handle numeric literals', () => {
            const {answer} = Transpiler.transpile('function answer() { return 42; }');
            expect(answer()).to.equal(42);
        });

        it('should return correct boolean value', () => {
            const {id} = Transpiler.transpile('function id(a) { return a; }');
            expect(id(true)).to.equal(1);
            expect(id(false)).to.equal(0);
        });

        it('should handle boolean literals', () => {
            const {alwaysTrue} = Transpiler.transpile('function alwaysTrue() { return true; }');
            expect(alwaysTrue()).to.equal(1);

            const {alwaysFalse} = Transpiler.transpile('function alwaysFalse() { return false; }');
            expect(alwaysFalse()).to.equal(0);
        });
    });
});
