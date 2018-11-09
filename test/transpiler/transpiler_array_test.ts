import {expect} from 'chai';
import Transpiler from '../../src/transpiler';

describe('Transpiler', () => {

    let transpiler: Transpiler;

    beforeEach(() => {
        transpiler = new Transpiler();
    });

    describe('#transpile()', () => {
        it('should handle array access', () => {
            const exports = transpiler.transpile('function array(arr) { return arr[0]; }');
            expect(exports.setFunctionName('array').call([1, 2, 3])).to.equal(1);
        });

        it('should handle array access using variable', () => {
            const exports = transpiler.transpile('function array(arr, i) { return arr[i]; }');
            exports.setFunctionName('array');

            expect(exports.call([11, 12, 13], 0)).to.equal(11);
            expect(exports.call([14, 15, 16], 1)).to.equal(15);
            expect(exports.call([17, 18, 19], 2)).to.equal(19);
        });

        it('should handle array access using expression', () => {
            const exports = transpiler.transpile('function array(arr) { return arr[1 + 2]; }');
            expect(exports.setFunctionName('array').call([101, 102, 103, 104, 105])).to.equal(104);
        });

        it('should handle multiple arrays', () => {
            const exports = transpiler.transpile('function array(arr, arr2) { return arr2[2]; }');
            expect(exports.setFunctionName('array').call([111, 112], [114, 115, 116])).to.equal(116);
        });

        it('should handle array size', () => {
            const exports = transpiler.transpile('function array(arr) { return arr[-1]; }');
            expect(exports.setFunctionName('array').call([1, 2, 4, 8])).to.equal(4);
        });

        it('should handle indexoutofbounds', () => {
            const exports = transpiler.transpile('function array(arr, i) { return arr[i]; }');
            exports.setFunctionName('array');

            expect(exports.call([1, 2], 2)).to.equal(0);
            expect(() => exports.call([1, 2], -2)).to.throw();
        });

        it('should not modify array', () => {
            const exports = transpiler.transpile('function array(arr) { return arr[0]; }');
            const array = [100, 200, 300];
            exports.setFunctionName('array').call(array);
            expect(array[0]).to.equal(100);
            expect(array[1]).to.equal(200);
            expect(array[2]).to.equal(300);
        });

        it('should handle length property', () => {
            const exports = transpiler.transpile('function length(arr) { return arr.length; }');
            exports.setFunctionName('length');

            expect(exports.call([0, 1, 2])).to.equal(3);
            expect(exports.call([])).to.equal(0);
            expect(exports.call([1])).to.equal(1);
        });

        it('shouldn\'t handle other properties', () => {
            expect(() => transpiler.transpile('function something(arr) { return arr.something; }')).to.throw();
        });

        it('should handle writes to array elements', () => {
            const exports = transpiler.transpile('function setFirst(arr) { arr[0] = 42; return arr[0]; }');
            exports.setFunctionName('setFirst');

            expect(exports.call([0, 1, 2])).to.equal(42);
            expect(exports.call([1])).to.equal(42);
        });

        it('should handle shorthand assignment to array elements', () => {
            const exports = transpiler.transpile('function setFirst(arr) { arr[0] += 42; return arr[0]; }');
            exports.setFunctionName('setFirst');

            expect(exports.call([5, 6, 7])).to.equal(47);
            expect(exports.call([4])).to.equal(46);
        });

        it('should handle pre increment on array', () => {
            const exports = transpiler.transpile('function preIncrement(arr) { ++arr[0]; return arr[0]; }');
            exports.setFunctionName('preIncrement');

            expect(exports.call([5, 6, 7])).to.equal(6);
            expect(exports.call([4])).to.equal(5);
        });

        it('should handle post increment on array', () => {
            const exports = transpiler.transpile('function postIncrement(arr) { arr[0]++; return arr[0]; }');
            exports.setFunctionName('postIncrement');

            expect(exports.call([15, 16, 17])).to.equal(16);
            expect(exports.call([14])).to.equal(15);
        });

        it('should handle pre decrement on array', () => {
            const exports = transpiler.transpile('function preDecrement(arr) { --arr[0]; return arr[0]; }');
            exports.setFunctionName('preDecrement');

            expect(exports.call([5, 6, 7])).to.equal(4);
            expect(exports.call([4])).to.equal(3);
        });

        it('should handle post decrement on array', () => {
            const exports = transpiler.transpile('function postDecrement(arr) { arr[0]--; return arr[0]; }');
            exports.setFunctionName('postDecrement');

            expect(exports.call([15, 16, 17])).to.equal(14);
            expect(exports.call([14])).to.equal(13);
        });

        it('should handle array export', () => {
            const exports = transpiler.transpile('function arrayExport(arr) { arr[0] = 5; return arr[0]; }');
            exports.setFunctionName('arrayExport');

            const array1 = [0];
            exports.call(array1);
            expect(array1[0]).to.equal(5);

            const array2 = [1, 2, 3];
            exports.call(array2);
            expect(array2[0]).to.equal(5);
            expect(array2[1]).to.equal(2);
            expect(array2[2]).to.equal(3);
        });

        it('should handle multiple array exports', () => {
            const content = 'function arrayExport(arr1, arr2) { arr1[0] = 21; arr2[1] = 22; return arr1[0]; }';
            const exports = transpiler.transpile(content);

            const array1 = [11, 12];
            const array2 = [13, 14, 15, 16];
            exports.setFunctionName('arrayExport').call(array1, array2);
            expect(array1[0]).to.equal(21);
            expect(array1[1]).to.equal(12);
            expect(array2[0]).to.equal(13);
            expect(array2[1]).to.equal(22);
            expect(array2[2]).to.equal(15);
            expect(array2[3]).to.equal(16);
        });

        it('should handle partial array export', () => {
            const content = 'function arrayExport(arr1, arr2) { arr1[0] = 41; return arr2[0]; }';
            const exports = transpiler.transpile(content);

            const array1 = [31, 32];
            const array2 = [33];
            exports.setFunctionName('arrayExport').call(array1, array2);
            expect(array1[0]).to.equal(41);
            expect(array1[1]).to.equal(32);
            expect(array2[0]).to.equal(33);
        });
    });
});
