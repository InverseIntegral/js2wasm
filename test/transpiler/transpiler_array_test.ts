import {expect} from 'chai';
import Transpiler from '../../src/transpiler';

describe('Transpiler', () => {
    describe('#transpile()', () => {
        it('should handle array access', () => {
            const exports = Transpiler.transpile('function array(arr) { return arr[0]; }');
            expect(exports('array', [1, 2, 3])).to.equal(1);
        });

        it('should handle array access using variable', () => {
            const exports = Transpiler.transpile('function array(arr, i) { return arr[i]; }');
            expect(exports('array', [1, 2, 3], 0)).to.equal(1);
            expect(exports('array', [1, 2, 3], 1)).to.equal(2);
            expect(exports('array', [1, 2, 3], 2)).to.equal(3);
        });

        it('should handle array access using expression', () => {
            const exports = Transpiler.transpile('function array(arr) { return arr[1 + 1]; }');
            expect(exports('array', [1, 2, 3])).to.equal(3);
        });

        it('should handle multiple arrays', () => {
            const exports = Transpiler.transpile('function array(arr, arr2) { return arr2[1]; }');
            expect(exports('array', [1, 2, 3], [4, 5, 6])).to.equal(5);
        });
    });
});
