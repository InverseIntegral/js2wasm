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
                .setSignature('array', WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64_ARRAY)
                .transpile('function array(arr) { return arr[0]; }');

            expect(wrapper.setFunctionName('array').call([1.5, 2.0, 3.0])).to.equal(1.5);
            expect(wrapper.setFunctionName('array').call([-1.5, 2.0, 3.0])).to.equal(-1.5);
            expect(wrapper.setFunctionName('array').call([6.656])).to.equal(6.656);
        });

        it('should handle array access using variable', () => {
            const wrapper = transpiler
                .setSignature('array', WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64_ARRAY, WebAssemblyType.INT_32)
                .transpile('function array(arr, i) { return arr[i]; }');
            wrapper.setFunctionName('array');

            expect(wrapper.call([11.1, 12.4, 13.7], 0)).to.equal(11.1);
            expect(wrapper.call([14.2, 15.5, 16.8], 1)).to.equal(15.5);
            expect(wrapper.call([17.3, 18.6, 19.9], 2)).to.equal(19.9);
        });

        it('should handle array access using expression', () => {
            const wrapper = transpiler
                .setSignature('array', WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64_ARRAY)
                .transpile('function array(arr) { return arr[1 + 2]; }');

            expect(wrapper.setFunctionName('array').call([101.9, 102.8, 103.7, 104.6, 105.5])).to.equal(104.6);
            expect(wrapper.setFunctionName('array').call([11.9, 12.8, 13.7, -14.6, 15.5])).to.equal(-14.6);
            expect(wrapper.setFunctionName('array').call([-11.9, -12.8, -13.7, 14.6])).to.equal(14.6);
        });

        it('should handle multiple arrays', () => {
            const wrapper = transpiler
                .setSignature('array', WebAssemblyType.FLOAT_64,
                    WebAssemblyType.FLOAT_64_ARRAY, WebAssemblyType.FLOAT_64_ARRAY)
                .transpile('function array(arr, arr2) { return arr2[2]; }');

            expect(wrapper.setFunctionName('array').call([111.11, 112.12], [114.14, 115.15, 116.15])).to.equal(116.15);
            expect(wrapper.setFunctionName('array').call([], [114.14, 115.15, 116.15])).to.equal(116.15);
            expect(wrapper.setFunctionName('array').call([-5.5], [-4.1, -15.15, -16.32])).to.equal(-16.32);
        });

        it('should handle out of bounds access', () => {
            const wrapper = transpiler
                .setSignature('array', WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64_ARRAY, WebAssemblyType.INT_32)
                .transpile('function array(arr, i) { return arr[i]; }');
            wrapper.setFunctionName('array');

            expect(() => wrapper.call([1.55, 2.55], 20000)).to.throw();
            expect(() => wrapper.call([1.6, 2.6], -2)).to.throw();
        });

        it('should not modify array', () => {
            const wrapper = transpiler
                .setSignature('array', WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64_ARRAY)
                .transpile('function array(arr) { return arr[0]; }');

            let array = [10.01, 20.01, 30.01];
            wrapper.setFunctionName('array').call(array);
            expect(array).to.eql([10.01, 20.01, 30.01]);

            array = [3.5];
            wrapper.setFunctionName('array').call(array);
            expect(array).to.eql([3.5]);

            array = [-5.555, -3.9];
            wrapper.setFunctionName('array').call(array);
            expect(array).to.eql([-5.555, -3.9]);
        });

        it('should handle length property', () => {
            const wrapper = transpiler
                .setSignature('length', WebAssemblyType.INT_32, WebAssemblyType.FLOAT_64_ARRAY)
                .transpile('function length(arr) { return arr.length; }');
            wrapper.setFunctionName('length');

            expect(wrapper.call([0.0, 1.111, 23.3])).to.equal(3);
            expect(wrapper.call([])).to.equal(0);
            expect(wrapper.call([1.909])).to.equal(1);
        });

        it('shouldn\'t handle other properties', () => {
            expect(() => transpiler
                .setSignature('something', WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64_ARRAY)
                .transpile('function something(arr) { return arr.something; }')).to.throw();
        });

        it('should handle writes to array elements', () => {
            const wrapper = transpiler
                .setSignature('setFirst', WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64_ARRAY)
                .transpile('function setFirst(arr) { arr[0] = 42.2; return arr[0]; }');
            wrapper.setFunctionName('setFirst');

            expect(wrapper.call([0.1, 1.1, 2.1])).to.equal(42.2);
            expect(wrapper.call([1.5])).to.equal(42.2);
        });

        it('should handle shorthand assignment to array elements', () => {
            const wrapper = transpiler
                .setSignature('setFirst', WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64_ARRAY)
                .transpile('function setFirst(arr) { arr[0] += 42; return arr[0]; }');
            wrapper.setFunctionName('setFirst');

            expect(wrapper.call([5.6, 6.1, 7.3])).to.equal(47.6);
            expect(wrapper.call([4.5])).to.equal(46.5);
        });

        it('should handle pre increment on array', () => {
            const wrapper = transpiler
                .setSignature('preIncrement', WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64_ARRAY)
                .transpile('function preIncrement(arr) { ++arr[0]; return arr[0]; }');
            wrapper.setFunctionName('preIncrement');

            expect(wrapper.call([5.6, 6.1, 7.3])).to.equal(6.6);
            expect(wrapper.call([4.5])).to.equal(5.5);
        });

        it('should handle post increment on array', () => {
            const wrapper = transpiler
                .setSignature('postIncrement', WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64_ARRAY)
                .transpile('function postIncrement(arr) { arr[0]++; return arr[0]; }');
            wrapper.setFunctionName('postIncrement');

            expect(wrapper.call([15.6, 16.1, 17.3])).to.equal(16.6);
            expect(wrapper.call([14.3])).to.equal(15.3);
        });

        it('should handle pre decrement on array', () => {
            const wrapper = transpiler
                .setSignature('preDecrement', WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64_ARRAY)
                .transpile('function preDecrement(arr) { --arr[0]; return arr[0]; }');
            wrapper.setFunctionName('preDecrement');

            expect(wrapper.call([5.6, 6.5, 7.6])).to.equal(4.6);
            expect(wrapper.call([4.1])).to.be.closeTo(3.1, 0.1);
        });

        it('should handle post decrement on array', () => {
            const wrapper = transpiler
                .setSignature('postDecrement', WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64_ARRAY)
                .transpile('function postDecrement(arr) { arr[0]--; return arr[0]; }');
            wrapper.setFunctionName('postDecrement');

            expect(wrapper.call([15.6, 16.5, 17.7])).to.equal(14.6);
            expect(wrapper.call([14.1])).to.equal(13.1);
        });

        it('should handle assign array value', () => {
            const wrapper = transpiler
                .setSignature('assign', WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64_ARRAY)
                .transpile('function assign(arr) { var x = 2.1; x = arr[0]; return x; }');
            wrapper.setFunctionName('assign');

            expect(wrapper.call([13.1, 16.1])).to.equal(13.1);
            expect(wrapper.call([-5.001, -16.1])).to.equal(-5.001);
        });

        it('should handle shorthand assign array value', () => {
            const wrapper = transpiler
                .setSignature('shorthandAssign', WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64_ARRAY)
                .transpile('function shorthandAssign(arr) { var x = 2.001; x += arr[0]; return x; }');
            wrapper.setFunctionName('shorthandAssign');

            expect(wrapper.call([15.1, 16.3])).to.equal(17.101);
            expect(wrapper.call([-14.1, 16.3])).to.equal(-12.099);
        });

        it('should handle addition with array value', () => {
            const wrapper = transpiler
                .setSignature('add', WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64_ARRAY)
                .transpile('function add(arr) { var x = 2; var y; y = x + arr[0]; return y; }');
            wrapper.setFunctionName('add');

            expect(wrapper.call([15.3, 16.55])).to.equal(17.3);
            expect(wrapper.call([-9.3, 16.55])).to.be.closeTo(-7.3, 0.1);
        });

        it('should handle subtraction with array value', () => {
            const wrapper = transpiler
                .setSignature('sub', WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64_ARRAY)
                .transpile('function sub(arr) { var x = 2; var y; y = x - arr[0]; return y; }');
            wrapper.setFunctionName('sub');

            expect(wrapper.call([15.3, 16.55])).to.equal(-13.3);
            expect(wrapper.call([-3.3, 16.55])).to.equal(5.3);
        });

        it('should handle multiplication with array value', () => {
            const wrapper = transpiler
                .setSignature('mul', WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64_ARRAY)
                .transpile('function mul(arr) { var x = 2; var y; y = x * arr[0]; return y; }');
            wrapper.setFunctionName('mul');

            expect(wrapper.call([15.4, 16.6])).to.equal(30.8);
            expect(wrapper.call([-2.3, 16.6])).to.equal(-4.6);
        });

        it('should handle division with array value', () => {
            const wrapper = transpiler
                .setSignature('div', WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64_ARRAY)
                .transpile('function div(arr) { var x = 2; var y; y = x / arr[0]; return y; }');
            wrapper.setFunctionName('div');

            expect(wrapper.call([15.1, 16.1])).to.be.closeTo(0.13, 0.003);
            expect(wrapper.call([1.1, 1.1])).to.be.closeTo(1.8, 0.1);
        });

        it('should handle array export', () => {
            const wrapper = transpiler
                .setSignature('arrayExport', WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64_ARRAY)
                .transpile('function arrayExport(arr) { arr[0] = 5.1; return arr[0]; }');
            wrapper.setFunctionName('arrayExport');

            const array1 = [0.3];
            wrapper.setOutParameters(array1).call(array1);
            expect(array1).to.eql([5.1]);

            const array2 = [1.3, 2.3, 3.33];
            wrapper.setOutParameters(array2).call(array2);
            expect(array2).to.eql([5.1, 2.3, 3.33]);
        });

        it('should handle array export with non exportable values', () => {
            const content = 'function arrayExport(arr, value) { arr[0] = value; return arr[0]; }';
            const wrapper = transpiler
                .setSignature('arrayExport', WebAssemblyType.FLOAT_64,
                    WebAssemblyType.FLOAT_64_ARRAY, WebAssemblyType.FLOAT_64)
                .transpile(content);
            wrapper.setFunctionName('arrayExport');

            const array = [3.5];
            wrapper.setOutParameters(array).call(array, 6.6);
            expect(array).to.eql([6.6]);
        });

        it('should handle multiple array exports', () => {
            const content = 'function arrayExport(arr1, arr2) { arr1[0] = 21.11; arr2[1] = 22.22; return arr1[0]; }';
            const wrapper = transpiler
                .setSignature('arrayExport', WebAssemblyType.FLOAT_64,
                    WebAssemblyType.FLOAT_64_ARRAY, WebAssemblyType.FLOAT_64_ARRAY)
                .transpile(content);

            const array1 = [1.123, 12.123];
            const array2 = [13.123, 14.123, 15.123, 16.123];

            wrapper.setFunctionName('arrayExport')
                .setOutParameters(array1, array2)
                .call(array1, array2);

            expect(array1).to.eql([21.11, 12.123]);
            expect(array2).to.eql([13.123, 22.22, 15.123, 16.123]);
        });

        it('should handle partial array export', () => {
            const content = 'function arrayExport(arr1, arr2) { arr1[0] = 41.01; arr2[0] = 42.2; return arr2[0]; }';
            const wrapper = transpiler
                .setSignature('arrayExport', WebAssemblyType.FLOAT_64,
                    WebAssemblyType.FLOAT_64_ARRAY, WebAssemblyType.FLOAT_64_ARRAY)
                .transpile(content);

            const array1 = [31.5, 32.9];
            const array2 = [33.66];

            const result = wrapper.setFunctionName('arrayExport')
                .setOutParameters(array1)
                .call(array1, array2);

            expect(result).to.equal(42.2);
            expect(array1).to.eql([41.01, 32.9]);
            expect(array2).to.eql([33.66]);
        });

        it('should handle different out and call parameter order in array export', () => {
            const content = 'function arrayExport(arr1, arr2) { arr1[0] = 61.4; arr2[0] = 62.77; return arr1[0]; }';
            const wrapper = transpiler
                .setSignature('arrayExport', WebAssemblyType.FLOAT_64,
                    WebAssemblyType.FLOAT_64_ARRAY, WebAssemblyType.FLOAT_64_ARRAY)
                .transpile(content);

            const array1 = [51.15];
            const array2 = [52.25, 53.35];

            wrapper.setFunctionName('arrayExport')
                .setOutParameters(array2, array1)
                .call(array1, array2);

            expect(array1).to.eql([61.4]);
            expect(array2).to.eql([62.77, 53.35]);
        });

        it('should handle out parameter with no call parameters', () => {
            const content = 'function arrayExport() { return 1.2; }';
            const wrapper = transpiler
                .setSignature('arrayExport', WebAssemblyType.FLOAT_64)
                .transpile(content);

            expect(() => wrapper.setFunctionName('arrayExport').setOutParameters([71, 72]).call()).to.throw();
        });

        it('should handle nonexistent out parameter in array export', () => {
            const content = 'function arrayExport(arr) { return arr[0]; }';
            const wrapper = transpiler
                .setSignature('arrayExport', WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64_ARRAY)
                .transpile(content);

            expect(() => wrapper.setFunctionName('arrayExport').setOutParameters([71, 72]).call([71, 72])).to.throw();
        });

        it('should handle mixed array parameters', () => {
            const content = 'function arrayExport(arr1, arr2, arr3) { return arr1[0] + arr2[0] + arr3[0]; }';
            const wrapper = transpiler
                .setSignature('arrayExport', WebAssemblyType.FLOAT_64,
                    WebAssemblyType.FLOAT_64_ARRAY, WebAssemblyType.INT_32_ARRAY, WebAssemblyType.FLOAT_64_ARRAY)
                .transpile(content);

            wrapper.setFunctionName('arrayExport');

            expect(wrapper.call([5.5], [1, 2], [3.8, 4.4])).to.eq(10.3);
            expect(wrapper.call([-5.5, 4.5], [3], [5.5, -4.4])).to.eq(3);
            expect(wrapper.call([5.5, 4.5], [3], [-5.5])).to.eq(3);

            const content2 = 'function arrayExport(arr1, arr2, arr3) { return arr1[0] + arr2[0] + arr3[0]; }';
            const wrapper2 = transpiler
                .setSignature('arrayExport', WebAssemblyType.FLOAT_64,
                    WebAssemblyType.INT_32_ARRAY, WebAssemblyType.FLOAT_64_ARRAY, WebAssemblyType.INT_32_ARRAY)
                .transpile(content2);

            wrapper2.setFunctionName('arrayExport');

            expect(wrapper2.call([1, 2], [5.5], [3, 4])).to.eq(9.5);
            expect(wrapper2.call([-1, 2], [5.5], [1, 4])).to.eq(5.5);
            expect(wrapper2.call([-1, 2], [-5.5], [1, 4])).to.eq(-5.5);
            expect(wrapper2.call([-1], [-5.5, 3], [1, 5, 6])).to.eq(-5.5);
        });

        it('should handle mixed empty arrays', () => {
            const content = 'function arrayExport(arr1, arr2, arr3) { ' +
                'return arr1.length + arr2.length + arr3.length; ' +
                '}';

            const wrapper = transpiler
                .setSignature('arrayExport', WebAssemblyType.INT_32,
                    WebAssemblyType.INT_32_ARRAY, WebAssemblyType.FLOAT_64_ARRAY, WebAssemblyType.INT_32_ARRAY)
                .transpile(content);

            wrapper.setFunctionName('arrayExport');

            expect(wrapper.call([], [5.5], [])).to.eq(1);
            expect(wrapper.call([1], [5.5], [])).to.eq(2);
            expect(wrapper.call([], [5.5], [2])).to.eq(2);
            expect(wrapper.call([1], [5.5], [3])).to.eq(3);
            expect(wrapper.call([1], [], [2])).to.eq(2);
            expect(wrapper.call([1], [], [])).to.eq(1);
            expect(wrapper.call([], [], [2])).to.eq(1);
            expect(wrapper.call([], [], [])).to.eq(0);
        });

        it('should throw an error if double is assigned to int array', () => {
            const content = 'function arrayExport(arr) { ' +
                'arr[0] = 3.14; return true;' +
                '}';

            expect(() => transpiler
                .setSignature('arrayExport', WebAssemblyType.BOOLEAN, WebAssemblyType.INT_32_ARRAY)
                .transpile(content)).to.throw();
        });

        it('should throw an error if the type of a double array is changed 2', () => {
            const content = 'function arrayExport(arr) { ' +
                'arr[0] += 3.14; return true;' +
                '}';

            expect(() => transpiler
                .setSignature('arrayExport', WebAssemblyType.BOOLEAN, WebAssemblyType.INT_32_ARRAY)
                .transpile(content)).to.throw();
        });

        it('should handle integers in double array', () => {
            const content = 'function getSecond(arr) { return arr[1]; }';

            const wrapper = transpiler
                .setSignature('getSecond', WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64_ARRAY)
                .transpile(content);

            wrapper.setFunctionName('getSecond');

            expect(wrapper.call([1.5, 2.5])).to.eq(2.5);
            expect(wrapper.call([1.5, 2])).to.eq(2);
        });
    });
});
