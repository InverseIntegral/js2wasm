import {expect} from 'chai';
import Transpiler from '../../src/transpiler';

describe('Transpiler', () => {
    describe('#transpile()', () => {
        it('should import arrays', () => {
            const first = Transpiler.transpile('function first(arr) { return arr[0]; }');
            expect(first('first', [1, 2, 3])).to.equal(1);
        });
    });
});
