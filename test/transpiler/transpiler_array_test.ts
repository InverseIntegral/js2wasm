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
            expect(exports('array', [11, 12, 13], 0)).to.equal(11);
            expect(exports('array', [14, 15, 16], 1)).to.equal(15);
            expect(exports('array', [17, 18, 19], 2)).to.equal(19);
        });

        it('should handle array access using expression', () => {
            const exports = Transpiler.transpile('function array(arr) { return arr[1 + 2]; }');
            expect(exports('array', [101, 102, 103, 104, 105])).to.equal(104);
        });

        it('should handle multiple arrays', () => {
            const exports = Transpiler.transpile('function array(arr, arr2) { return arr2[2]; }');
            expect(exports('array', [111, 112], [114, 115, 116])).to.equal(116);
        });
    });
});
