import {expect} from 'chai';
import {createSingleIntegerOnlyFunction} from '../../src/generator/wasm_type';
import Transpiler from '../../src/transpiler';

describe('Transpiler', () => {
    describe('#transpile()', () => {
        it('should handle numeric literals', () => {
            const content = 'function answer() { return 42; }';
            const {answer} = Transpiler.transpile(content, createSingleIntegerOnlyFunction('answer', 0));
            expect(answer()).to.equal(42);
        });

        it('should return correct boolean value', () => {
            const content = 'function id(a) { return a; }';
            const {id} = Transpiler.transpile(content, createSingleIntegerOnlyFunction('id', 1));
            expect(id(true)).to.equal(1);
            expect(id(false)).to.equal(0);
        });

        it('should handle boolean literals', () => {
            const content1 = 'function alwaysTrue() { return true; }';
            const {alwaysTrue} = Transpiler.transpile(content1, createSingleIntegerOnlyFunction('alwaysTrue', 0));
            expect(alwaysTrue()).to.equal(1);

            const content = 'function alwaysFalse() { return false; }';
            const {alwaysFalse} = Transpiler.transpile(content, createSingleIntegerOnlyFunction('alwaysFalse', 0));
            expect(alwaysFalse()).to.equal(0);
        });
    });
});
