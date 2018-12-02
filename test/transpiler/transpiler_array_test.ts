import {expect} from 'chai';
import {WebAssemblyType} from '../../src/generator/wasm_type';
import Transpiler from '../../src/transpiler';

describe('Transpiler', () => {

    let transpiler: Transpiler;

    beforeEach(() => {
        transpiler = new Transpiler();
    });

    describe('#transpile()', () => {
        it('should handle array access', () => {
            const wrapper = transpiler
                .setSignature('array', WebAssemblyType.INT_32, WebAssemblyType.INT_32_ARRAY)
                .transpile('function array(arr) { return arr[0]; }');
            expect(wrapper.setFunctionName('array').call([1, 2, 3])).to.equal(1);
        });

        it('should handle array access using variable', () => {
            const wrapper = transpiler
                .setSignature('array', WebAssemblyType.INT_32, WebAssemblyType.INT_32_ARRAY, WebAssemblyType.INT_32)
                .transpile('function array(arr, i) { return arr[i]; }');
            wrapper.setFunctionName('array');

            expect(wrapper.call([11, 12, 13], 0)).to.equal(11);
            expect(wrapper.call([14, 15, 16], 1)).to.equal(15);
            expect(wrapper.call([17, 18, 19], 2)).to.equal(19);
        });

        it('should handle array access using expression', () => {
            const wrapper = transpiler
                .setSignature('array', WebAssemblyType.INT_32, WebAssemblyType.INT_32_ARRAY)
                .transpile('function array(arr) { return arr[1 + 2]; }');
            expect(wrapper.setFunctionName('array').call([101, 102, 103, 104, 105])).to.equal(104);
        });

        it('should handle multiple arrays', () => {
            const wrapper = transpiler
                .setSignature('array', WebAssemblyType.INT_32,
                    WebAssemblyType.INT_32_ARRAY, WebAssemblyType.INT_32_ARRAY)
                .transpile('function array(arr, arr2) { return arr2[2]; }');
            expect(wrapper.setFunctionName('array').call([111, 112], [114, 115, 116])).to.equal(116);
        });

        it('should handle array size', () => {
            const wrapper = transpiler
                .setSignature('array', WebAssemblyType.INT_32, WebAssemblyType.INT_32_ARRAY)
                .transpile('function array(arr) { return arr[-1]; }');
            expect(wrapper.setFunctionName('array').call([1, 2, 4, 8])).to.equal(4);
        });

        it('should handle indexoutofbounds', () => {
            const wrapper = transpiler
                .setSignature('array', WebAssemblyType.INT_32, WebAssemblyType.INT_32_ARRAY, WebAssemblyType.INT_32)
                .transpile('function array(arr, i) { return arr[i]; }');
            wrapper.setFunctionName('array');

            expect(wrapper.call([1, 2], 2)).to.equal(0);
            expect(() => wrapper.call([1, 2], -2)).to.throw();
        });

        it('should not modify array', () => {
            const wrapper = transpiler
                .setSignature('array', WebAssemblyType.INT_32, WebAssemblyType.INT_32_ARRAY)
                .transpile('function array(arr) { return arr[0]; }');

            const array = [100, 200, 300];
            wrapper.setFunctionName('array').call(array);
            expect(array).to.eql([100, 200, 300]);
        });

        it('should handle length property', () => {
            const wrapper = transpiler
                .setSignature('length', WebAssemblyType.INT_32, WebAssemblyType.INT_32_ARRAY)
                .transpile('function length(arr) { return arr.length; }');
            wrapper.setFunctionName('length');

            expect(wrapper.call([0, 1, 2])).to.equal(3);
            expect(wrapper.call([])).to.equal(0);
            expect(wrapper.call([1])).to.equal(1);
        });

        it('shouldn\'t handle other properties', () => {
            expect(() => transpiler
                .setSignature('something', WebAssemblyType.INT_32, WebAssemblyType.INT_32_ARRAY)
                .transpile('function something(arr) { return arr.something; }')).to.throw();
        });

        it('should handle writes to array elements', () => {
            const wrapper = transpiler
                .setSignature('setFirst', WebAssemblyType.INT_32, WebAssemblyType.INT_32_ARRAY)
                .transpile('function setFirst(arr) { arr[0] = 42; return arr[0]; }');
            wrapper.setFunctionName('setFirst');

            expect(wrapper.call([0, 1, 2])).to.equal(42);
            expect(wrapper.call([1])).to.equal(42);
        });

        it('should handle shorthand assignment to array elements', () => {
            const wrapper = transpiler
                .setSignature('setFirst', WebAssemblyType.INT_32, WebAssemblyType.INT_32_ARRAY)
                .transpile('function setFirst(arr) { arr[0] += 42; return arr[0]; }');
            wrapper.setFunctionName('setFirst');

            expect(wrapper.call([5, 6, 7])).to.equal(47);
            expect(wrapper.call([4])).to.equal(46);
        });

        it('should handle pre increment on array', () => {
            const wrapper = transpiler
                .setSignature('preIncrement', WebAssemblyType.INT_32, WebAssemblyType.INT_32_ARRAY)
                .transpile('function preIncrement(arr) { ++arr[0]; return arr[0]; }');
            wrapper.setFunctionName('preIncrement');

            expect(wrapper.call([5, 6, 7])).to.equal(6);
            expect(wrapper.call([4])).to.equal(5);
        });

        it('should handle post increment on array', () => {
            const wrapper = transpiler
                .setSignature('postIncrement', WebAssemblyType.INT_32, WebAssemblyType.INT_32_ARRAY)
                .transpile('function postIncrement(arr) { arr[0]++; return arr[0]; }');
            wrapper.setFunctionName('postIncrement');

            expect(wrapper.call([15, 16, 17])).to.equal(16);
            expect(wrapper.call([14])).to.equal(15);
        });

        it('should handle pre decrement on array', () => {
            const wrapper = transpiler
                .setSignature('preDecrement', WebAssemblyType.INT_32, WebAssemblyType.INT_32_ARRAY)
                .transpile('function preDecrement(arr) { --arr[0]; return arr[0]; }');
            wrapper.setFunctionName('preDecrement');

            expect(wrapper.call([5, 6, 7])).to.equal(4);
            expect(wrapper.call([4])).to.equal(3);
        });

        it('should handle post decrement on array', () => {
            const wrapper = transpiler
                .setSignature('postDecrement', WebAssemblyType.INT_32, WebAssemblyType.INT_32_ARRAY)
                .transpile('function postDecrement(arr) { arr[0]--; return arr[0]; }');
            wrapper.setFunctionName('postDecrement');

            expect(wrapper.call([15, 16, 17])).to.equal(14);
            expect(wrapper.call([14])).to.equal(13);
        });

        it('should handle assign array value', () => {
            const wrapper = transpiler
                .setSignature('assign', WebAssemblyType.INT_32, WebAssemblyType.INT_32_ARRAY)
                .transpile('function assign(arr) { var x = 2; x = arr[0]; return x; }');
            wrapper.setFunctionName('assign');

            expect(wrapper.call([15, 16])).to.equal(15);
        });

        it('should handle shorthand assign array value', () => {
            const wrapper = transpiler
                .setSignature('shorthandAssign', WebAssemblyType.INT_32, WebAssemblyType.INT_32_ARRAY)
                .transpile('function shorthandAssign(arr) { var x = 2; x += arr[0]; return x; }');
            wrapper.setFunctionName('shorthandAssign');

            expect(wrapper.call([15, 16])).to.equal(17);
        });

        it('should handle addition with array value', () => {
            const wrapper = transpiler
                .setSignature('add', WebAssemblyType.INT_32, WebAssemblyType.INT_32_ARRAY)
                .transpile('function add(arr) { var x = 2; var y; y = x + arr[0]; return y; }');
            wrapper.setFunctionName('add');

            expect(wrapper.call([15, 16])).to.equal(17);
        });

        it('should handle subtraction with array value', () => {
            const wrapper = transpiler
                .setSignature('sub', WebAssemblyType.INT_32, WebAssemblyType.INT_32_ARRAY)
                .transpile('function sub(arr) { var x = 2; var y; y = x - arr[0]; return y; }');
            wrapper.setFunctionName('sub');

            expect(wrapper.call([15, 16])).to.equal(-13);
        });

        it('should handle multiplication with array value', () => {
            const wrapper = transpiler
                .setSignature('mul', WebAssemblyType.INT_32, WebAssemblyType.INT_32_ARRAY)
                .transpile('function mul(arr) { var x = 2; var y; y = x * arr[0]; return y; }');
            wrapper.setFunctionName('mul');

            expect(wrapper.call([15, 16])).to.equal(30);
        });

        it('should handle division with array value', () => {
            const wrapper = transpiler
                .setSignature('div', WebAssemblyType.INT_32, WebAssemblyType.INT_32_ARRAY)
                .transpile('function div(arr) { var x = 2; var y; y = x / arr[0]; return y; }');
            wrapper.setFunctionName('div');

            expect(wrapper.call([15, 16])).to.equal(0);
        });

        it('should handle modulo with array value', () => {
            const wrapper = transpiler
                .setSignature('mod', WebAssemblyType.INT_32, WebAssemblyType.INT_32_ARRAY)
                .transpile('function mod(arr) { var x = 30; var y; y = x % arr[0]; return y; }');
            wrapper.setFunctionName('mod');

            expect(wrapper.call([15, 16])).to.equal(0);
        });

        it('should handle array as parameter of function call', () => {
            const content = 'function func(arr) { return arr[0]; }' +
                'function main(arr) { return func(arr); }';
            const wrapper = transpiler
                .setSignature('main', WebAssemblyType.INT_32, WebAssemblyType.INT_32_ARRAY)
                .setSignature('func', WebAssemblyType.INT_32, WebAssemblyType.INT_32_ARRAY)
                .transpile(content);
            wrapper.setFunctionName('main');

            expect(wrapper.call([11, 22])).to.equal(11);
            expect(wrapper.call([-33, -44])).to.equal(-33);
        });

        it('should handle array export', () => {
            const wrapper = transpiler
                .setSignature('arrayExport', WebAssemblyType.INT_32, WebAssemblyType.INT_32_ARRAY)
                .transpile('function arrayExport(arr) { arr[0] = 5; return arr[0]; }');
            wrapper.setFunctionName('arrayExport');

            const array1 = [0];
            wrapper.setOutParameters(array1).call(array1);
            expect(array1).to.eql([5]);

            const array2 = [1, 2, 3];
            wrapper.setOutParameters(array2).call(array2);
            expect(array2).to.eql([5, 2, 3]);
        });

        it('should handle array export with non exportable values', () => {
            const content = 'function arrayExport(arr, value) { arr[0] = value; return arr[0]; }';
            const wrapper = transpiler
                .setSignature('arrayExport', WebAssemblyType.INT_32,
                    WebAssemblyType.INT_32_ARRAY, WebAssemblyType.INT_32)
                .transpile(content);
            wrapper.setFunctionName('arrayExport');

            const array = [0];
            wrapper.setOutParameters(array).call(array, 3);
            expect(array).to.eql([3]);
        });

        it('should handle multiple array exports', () => {
            const content = 'function arrayExport(arr1, arr2) { arr1[0] = 21; arr2[1] = 22; return arr1[0]; }';
            const wrapper = transpiler
                .setSignature('arrayExport', WebAssemblyType.INT_32,
                    WebAssemblyType.INT_32_ARRAY, WebAssemblyType.INT_32_ARRAY)
                .transpile(content);

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
            const wrapper = transpiler
                .setSignature('arrayExport', WebAssemblyType.INT_32,
                    WebAssemblyType.INT_32_ARRAY, WebAssemblyType.INT_32_ARRAY)
                .transpile(content);

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
            const wrapper = transpiler
                .setSignature('arrayExport', WebAssemblyType.INT_32,
                    WebAssemblyType.INT_32_ARRAY, WebAssemblyType.INT_32_ARRAY)
                .transpile(content);

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
            const wrapper = transpiler
                .setSignature('arrayExport', WebAssemblyType.INT_32)
                .transpile(content);

            expect(() => wrapper.setFunctionName('arrayExport').setOutParameters([71, 72]).call()).to.throw();
        });

        it('should handle nonexistent out parameter in array export', () => {
            const content = 'function arrayExport(arr) { return arr[0]; }';
            const wrapper = transpiler
                .setSignature('arrayExport', WebAssemblyType.INT_32, WebAssemblyType.INT_32_ARRAY)
                .transpile(content);

            expect(() => wrapper.setFunctionName('arrayExport').setOutParameters([71, 72]).call([71, 72])).to.throw();
        });
    });
});
