import {expect} from 'chai';
import Transpiler from '../../src/transpiler';

describe('Transpiler', () => {

    let transpiler: Transpiler;

    beforeEach(() => {
        transpiler = new Transpiler();
    });

    describe('#transpile()', () => {
        it('should handle array access', () => {
            const wrapper = transpiler.transpile('function array(arr) { return arr[0]; }');
            expect(wrapper.setFunctionName('array').call([1, 2, 3])).to.equal(1);
        });

        it('should handle array access using variable', () => {
            const wrapper = transpiler.transpile('function array(arr, i) { return arr[i]; }');
            wrapper.setFunctionName('array');

            expect(wrapper.call([11, 12, 13], 0)).to.equal(11);
            expect(wrapper.call([14, 15, 16], 1)).to.equal(15);
            expect(wrapper.call([17, 18, 19], 2)).to.equal(19);
        });

        it('should handle array access using expression', () => {
            const wrapper = transpiler.transpile('function array(arr) { return arr[1 + 2]; }');
            expect(wrapper.setFunctionName('array').call([101, 102, 103, 104, 105])).to.equal(104);
        });

        it('should handle multiple arrays', () => {
            const wrapper = transpiler.transpile('function array(arr, arr2) { return arr2[2]; }');
            expect(wrapper.setFunctionName('array').call([111, 112], [114, 115, 116])).to.equal(116);
        });

        it('should handle array size', () => {
            const wrapper = transpiler.transpile('function array(arr) { return arr[-1]; }');
            expect(wrapper.setFunctionName('array').call([1, 2, 4, 8])).to.equal(4);
        });

        it('should handle indexoutofbounds', () => {
            const wrapper = transpiler.transpile('function array(arr, i) { return arr[i]; }');
            wrapper.setFunctionName('array');

            expect(wrapper.call([1, 2], 2)).to.equal(0);
            expect(() => wrapper.call([1, 2], -2)).to.throw();
        });

        it('should not modify array', () => {
            const wrapper = transpiler.transpile('function array(arr) { return arr[0]; }');
            const array = [100, 200, 300];
            wrapper.setFunctionName('array').call(array);
            expect(array).to.eql([100, 200, 300]);
        });

        it('should handle length property', () => {
            const wrapper = transpiler.transpile('function length(arr) { return arr.length; }');
            wrapper.setFunctionName('length');

            expect(wrapper.call([0, 1, 2])).to.equal(3);
            expect(wrapper.call([])).to.equal(0);
            expect(wrapper.call([1])).to.equal(1);
        });

        it('shouldn\'t handle other properties', () => {
            expect(() => transpiler.transpile('function something(arr) { return arr.something; }')).to.throw();
        });

        it('should handle writes to array elements', () => {
            const wrapper = transpiler.transpile('function setFirst(arr) { arr[0] = 42; return arr[0]; }');
            wrapper.setFunctionName('setFirst');

            expect(wrapper.call([0, 1, 2])).to.equal(42);
            expect(wrapper.call([1])).to.equal(42);
        });

        it('should handle shorthand assignment to array elements', () => {
            const wrapper = transpiler.transpile('function setFirst(arr) { arr[0] += 42; return arr[0]; }');
            wrapper.setFunctionName('setFirst');

            expect(wrapper.call([5, 6, 7])).to.equal(47);
            expect(wrapper.call([4])).to.equal(46);
        });

        it('should handle pre increment on array', () => {
            const wrapper = transpiler.transpile('function preIncrement(arr) { ++arr[0]; return arr[0]; }');
            wrapper.setFunctionName('preIncrement');

            expect(wrapper.call([5, 6, 7])).to.equal(6);
            expect(wrapper.call([4])).to.equal(5);
        });

        it('should handle post increment on array', () => {
            const wrapper = transpiler.transpile('function postIncrement(arr) { arr[0]++; return arr[0]; }');
            wrapper.setFunctionName('postIncrement');

            expect(wrapper.call([15, 16, 17])).to.equal(16);
            expect(wrapper.call([14])).to.equal(15);
        });

        it('should handle pre decrement on array', () => {
            const wrapper = transpiler.transpile('function preDecrement(arr) { --arr[0]; return arr[0]; }');
            wrapper.setFunctionName('preDecrement');

            expect(wrapper.call([5, 6, 7])).to.equal(4);
            expect(wrapper.call([4])).to.equal(3);
        });

        it('should handle post decrement on array', () => {
            const wrapper = transpiler.transpile('function postDecrement(arr) { arr[0]--; return arr[0]; }');
            wrapper.setFunctionName('postDecrement');

            expect(wrapper.call([15, 16, 17])).to.equal(14);
            expect(wrapper.call([14])).to.equal(13);
        });

        it('should handle array export', () => {
            const wrapper = transpiler.transpile('function arrayExport(arr) { arr[0] = 5; return arr[0]; }');
            wrapper.setFunctionName('arrayExport');

            const array1 = [0];
            wrapper.setOutParameters(array1).call(array1);
            expect(array1).to.eql([5]);

            const array2 = [1, 2, 3];
            wrapper.setOutParameters(array2).call(array2);
            expect(array2).to.eql([5, 2, 3]);
        });

        it('should handle array export with non exportable values', () => {
            const wrapper = transpiler.transpile('function arrayExport(arr, value) { arr[0] = value; return arr[0]; }');
            wrapper.setFunctionName('arrayExport');

            const array = [0];
            wrapper.setOutParameters(array).call(array, 3);
            expect(array).to.eql([3]);
        });

        it('should handle multiple array exports', () => {
            const content = 'function arrayExport(arr1, arr2) { arr1[0] = 21; arr2[1] = 22; return arr1[0]; }';
            const wrapper = transpiler.transpile(content);

            const array1 = [11, 12];
            const array2 = [13, 14, 15, 16];

            wrapper.setFunctionName('arrayExport')
                .setOutParameters(array1, array2)
                .call(array1, array2);

            expect(array1).to.eql([21, 12]);
            expect(array2).to.eql([13, 22, 15, 16]);
        });

        it('should handle partial array export', () => {
            const content = 'function arrayExport(arr1, arr2) { arr1[0] = 41; arr2[0] = 42; return arr2[0]; }';
            const wrapper = transpiler.transpile(content);

            const array1 = [31, 32];
            const array2 = [33];

            const result = wrapper.setFunctionName('arrayExport')
                .setOutParameters(array1)
                .call(array1, array2);

            expect(result).to.equal(42);
            expect(array1).to.eql([41, 32]);
            expect(array2).to.eql([33]);
        });

        it('should handle different out and call parameter order in array export', () => {
            const content = 'function arrayExport(arr1, arr2) { arr1[0] = 61; arr2[0] = 62; return arr1[0]; }';
            const wrapper = transpiler.transpile(content);

            const array1 = [51];
            const array2 = [52, 53];

            wrapper.setFunctionName('arrayExport')
                .setOutParameters(array2, array1)
                .call(array1, array2);

            expect(array1).to.eql([61]);
            expect(array2).to.eql([62, 53]);
        });

        it('should handle out parameter with no call parameters', () => {
            const content = 'function arrayExport() { return 0; }';
            const wrapper = transpiler.transpile(content);

            expect(() => wrapper.setFunctionName('arrayExport').setOutParameters([71, 72]).call()).to.throw();
        });

        it('should handle nonexistent out parameter in array export', () => {
            const content = 'function arrayExport(arr) { return arr[0]; }';
            const wrapper = transpiler.transpile(content);

            expect(() => wrapper.setFunctionName('arrayExport').setOutParameters([71, 72]).call([71, 72])).to.throw();
        });

        it('should handle array declaration', () => {
            const content = 'function func() { var array = [1, 2, 3]; return 0; }';
            const wrapper = transpiler.transpile(content);

            expect(wrapper.setFunctionName('func').call()).to.equal(0);
        });

        it('should handle array literal access', () => {
            const content = 'function func(index) { var array = [5, 9]; return array[index]; }';
            const wrapper = transpiler.transpile(content);
            wrapper.setFunctionName('func');

            expect(wrapper.call(0)).to.equal(5);
            expect(wrapper.call(1)).to.equal(9);
        });

        it('should handle array literal manipulation', () => {
            const content = 'function func(index, value) {' +
                'var array = [23, 46, 7]; array[index] = value; return array[index]; }';
            const wrapper = transpiler.transpile(content);
            wrapper.setFunctionName('func');

            expect(wrapper.call(0, 11)).to.equal(11);
            expect(wrapper.call(1, 50)).to.equal(50);
            expect(wrapper.call(2, 93)).to.equal(93);
        });

        it('should handle array literal length', () => {
            const content = 'function func() { var array = [1, 2, 3]; return array.length; }';
            const wrapper = transpiler.transpile(content);
            wrapper.setFunctionName('func');

            expect(wrapper.call()).to.equal(3);
        });

        it('should handle multiple array literals', () => {
            const content = 'function func() {' +
                'var array = [40, 42, 24]; var array2 = [10, 11, 12]; return array2[0]; }';
            const wrapper = transpiler.transpile(content);
            wrapper.setFunctionName('func');

            expect(wrapper.call()).to.equal(10);
        });

        it('should handle array literals with array parameters', () => {
            const content = 'function func(arr) { var array = [10, 11, 12]; arr[0] = 1; return array[0]; }';
            const wrapper = transpiler.transpile(content);

            const array = [13, 14, 15, 16];
            wrapper.setFunctionName('func').setOutParameters(array);

            expect(wrapper.call(array)).to.equal(10);
            expect(array).to.eql([1, 14, 15, 16]);
        });

        it('should handle array literals with variables', () => {
            const content = 'function func(index, a) { var b = 15; var array = [a, b]; return array[index]; }';
            const wrapper = transpiler.transpile(content);

            wrapper.setFunctionName('func');

            expect(wrapper.call(0, 14)).to.equal(14);
            expect(wrapper.call(1, 16)).to.equal(15);
        });
    });
});
