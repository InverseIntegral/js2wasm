import {expect} from 'chai';
import {WebAssemblyType} from '../../src/generator/wasm_type';
import Transpiler from '../../src/transpiler';

describe('Transpiler', () => {

    let transpiler: Transpiler;

    beforeEach(() => {
        transpiler = new Transpiler();
    });

    describe('#transpile()', () => {
        it('should handle double return value', () => {
            const wrapper = transpiler
                .setSignature('double', WebAssemblyType.FLOAT_64)
                .transpile('function double() { return 1.34; } ');

            expect(wrapper.setFunctionName('double').call()).to.closeTo(1.34, 0.001);
        });

        it('should handle double parameter', () => {
            const wrapper = transpiler
                .setSignature('double', WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64)
                .transpile('function double(value) { return value; } ');

            expect(wrapper.setFunctionName('double').call(3.14)).to.closeTo(3.14, 0.001);
            expect(wrapper.setFunctionName('double').call(2.52)).to.closeTo(2.52, 0.001);
        });

        it('should handle double parameter with integer values', () => {
            const wrapper = transpiler
                .setSignature('double', WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64)
                .transpile('function double(value) { return value; } ');

            expect(wrapper.setFunctionName('double').call(9)).to.closeTo(9, 0.1);
            expect(wrapper.setFunctionName('double').call(-5)).to.closeTo(-5, 0.1);
            expect(wrapper.setFunctionName('double').call(0)).to.closeTo(0, 0.1);
            expect(wrapper.setFunctionName('double').call(-0)).to.closeTo(0, 0.1);
        });

        it('should handle double variable declaration with direct assignment', () => {
            const wrapper = transpiler
                .setSignature('double', WebAssemblyType.FLOAT_64)
                .transpile('function double() { var value = 5.3113; return value; } ');

            expect(wrapper.setFunctionName('double').call()).to.closeTo(5.3113, 0.00001);
        });

        it('should handle double variable declaration without direct assignment', () => {
            const wrapper = transpiler
                .setSignature('double', WebAssemblyType.FLOAT_64)
                .transpile('function double() { var value; value = 5.3113; return value; } ');

            expect(wrapper.setFunctionName('double').call()).to.closeTo(5.3113, 0.00001);
        });

        it('should handle double unary plus', () => {
            const wrapper = transpiler
                .setSignature('double', WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64)
                .transpile('function double(a) { return +a; }');
            wrapper.setFunctionName('double');

            expect(wrapper.call(31.412)).to.closeTo(31.412, 0.0001);
            expect(wrapper.call(-231.4129)).to.closeTo(-231.4129, 0.00001);
            expect(wrapper.call(0.0)).to.closeTo(0.0, 0.01);
        });

        it('should handle double unary minus', () => {
            const wrapper = transpiler
                .setSignature('double', WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64)
                .transpile('function double(a) { return -a ; }');
            wrapper.setFunctionName('double');

            expect(wrapper.call(132.319)).to.closeTo(-132.319, 0.0001);
            expect(wrapper.call(-18.95)).to.closeTo(18.95, 0.001);
            expect(wrapper.call(0.0)).to.closeTo(0.0, 0.01);
            expect(wrapper.call(-0.0)).to.closeTo(0.0, 0.01);
        });

        it('should handle multiple consecutive double unary operators', () => {
            const wrapper = transpiler
                .setSignature('double', WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64)
                .transpile('function double(a) { return -+-+-a; }');
            wrapper.setFunctionName('double');

            expect(wrapper.call(2.12)).to.closeTo(-2.12, 0.001);
            expect(wrapper.call(-9.49)).to.closeTo(9.49, 0.001);
        });

        it('should handle double pre increment', () => {
            const content = 'function preInc(a) { ++a; return a; }';
            const wrapper = transpiler
                .setSignature('preInc', WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64)
                .transpile(content);

            expect(wrapper.setFunctionName('preInc').call(12.34)).to.closeTo(13.34, 0.001);
            expect(wrapper.setFunctionName('preInc').call(4.93)).to.closeTo(5.93, 0.001);
        });

        it('should handle double post increment', () => {
            const content = 'function postInc(a) { a++; return a; }';
            const wrapper = transpiler
                .setSignature('postInc', WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64)
                .transpile(content);

            expect(wrapper.setFunctionName('postInc').call(4.92)).to.closeTo(5.92, 0.001);
            expect(wrapper.setFunctionName('postInc').call(7.26)).to.closeTo(8.26, 0.001);
        });

        it('should handle double pre decrement', () => {
            const content = 'function preDec(a) { --a; return a; }';
            const wrapper = transpiler
                .setSignature('preDec', WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64)
                .transpile(content);

            expect(wrapper.setFunctionName('preDec').call(93.89)).to.closeTo(92.89, 0.001);
            expect(wrapper.setFunctionName('preDec').call(5.44)).to.closeTo(4.44, 0.001);
        });

        it('should handle double post decrement', () => {
            const content = 'function postDec(a) { a--; return a; }';
            const wrapper = transpiler
                .setSignature('postDec', WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64)
                .transpile(content);

            expect(wrapper.setFunctionName('postDec').call(28.19)).to.closeTo(27.19, 0.001);
            expect(wrapper.setFunctionName('postDec').call(16.35)).to.closeTo(15.35, 0.001);
        });

        it('should handle double addition', () => {
            const wrapper = transpiler
                .setSignature('add', WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64)
                .transpile('function add(a, b) { return a + b; }');
            wrapper.setFunctionName('add');

            expect(wrapper.call(1.13, 2.41)).to.closeTo(3.54, 0.001);
            expect(wrapper.call(-100.53, 2.1)).to.closeTo(-98.43, 0.001);
        });

        it('should handle double-int combination addition', () => {
            const content = 'function add(a, b) { return a + b; }';
            const wrapper = transpiler
                .setSignature('add', WebAssemblyType.FLOAT_64, WebAssemblyType.INT_32, WebAssemblyType.FLOAT_64)
                .transpile(content);
            wrapper.setFunctionName('add');

            expect(wrapper.call(5, 14.9)).to.closeTo(19.9, 0.01);
            expect(wrapper.call(-100, 12.59)).to.closeTo(-87.41, 0.001);
            expect(wrapper.call(20, -13.01)).to.closeTo(6.99, 0.001);
            expect(wrapper.call(-9, -2.4)).to.closeTo(-11.4, 0.01);

            const wrapper2 = new Transpiler()
                .setSignature('add', WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64, WebAssemblyType.INT_32)
                .transpile(content);
            wrapper2.setFunctionName('add');

            expect(wrapper2.call(5.31, 4)).to.closeTo(9.31, 0.001);
            expect(wrapper2.call(14.1, -3)).to.closeTo(11.1, 0.01);
            expect(wrapper2.call(-23.4, 35)).to.closeTo(11.6, 0.01);
            expect(wrapper2.call(-9.5, -2)).to.closeTo(-11.5, 0.01);
        });

        it('should handle double addition with array', () => {
            const wrapper = transpiler
                .setSignature('add', WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64, WebAssemblyType.INT_32_ARRAY)
                .transpile('function add(a, b) { return a + b[0]; }');
            wrapper.setFunctionName('add');

            expect(wrapper.call(1.13, [1, 2])).to.closeTo(2.13, 0.001);
            expect(wrapper.call(6.72, [3, 4])).to.closeTo(9.72, 0.001);

            const wrapper2 = transpiler
                .setSignature('add', WebAssemblyType.FLOAT_64, WebAssemblyType.INT_32_ARRAY, WebAssemblyType.FLOAT_64)
                .transpile('function add(a, b) { return a[0] + b; }');
            wrapper2.setFunctionName('add');

            expect(wrapper2.call([1, 2], 2.45)).to.closeTo(3.45, 0.001);
            expect(wrapper2.call([3, 4], 9.22)).to.closeTo(12.22, 0.001);
        });

        it('should handle double subtraction', () => {
            const wrapper = transpiler
                .setSignature('sub', WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64)
                .transpile('function sub(a, b) { return a - b; }');
            wrapper.setFunctionName('sub');

            expect(wrapper.call(1.41, 2.14)).to.closeTo(-0.73, 0.001);
            expect(wrapper.call(-20.145, 20.145)).to.closeTo(-40.29, 0.001);
        });

        it('should handle double-int combination subtraction', () => {
            const content = 'function sub(a, b) { return a - b; }';
            const wrapper = transpiler
                .setSignature('sub', WebAssemblyType.FLOAT_64, WebAssemblyType.INT_32, WebAssemblyType.FLOAT_64)
                .transpile(content);
            wrapper.setFunctionName('sub');

            expect(wrapper.call(5, 14.9)).to.closeTo(-9.9, 0.01);
            expect(wrapper.call(-100, 12.59)).to.closeTo(-112.59, 0.001);
            expect(wrapper.call(20, -13.01)).to.closeTo(33.01, 0.001);
            expect(wrapper.call(-9, -2.4)).to.closeTo(-6.6, 0.01);

            const wrapper2 = new Transpiler()
                .setSignature('sub', WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64, WebAssemblyType.INT_32)
                .transpile(content);
            wrapper2.setFunctionName('sub');

            expect(wrapper2.call(5.31, 4)).to.closeTo(1.31, 0.001);
            expect(wrapper2.call(14.1, -3)).to.closeTo(17.1, 0.01);
            expect(wrapper2.call(-23.4, 35)).to.closeTo(-58.4, 0.01);
            expect(wrapper2.call(-9.5, -2)).to.closeTo(-7.5, 0.01);
        });

        it('should handle double subtraction with array', () => {
            const wrapper = transpiler
                .setSignature('sub', WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64, WebAssemblyType.INT_32_ARRAY)
                .transpile('function sub(a, b) { return a - b[0]; }');
            wrapper.setFunctionName('sub');

            expect(wrapper.call(1.13, [1, 2])).to.closeTo(0.13, 0.001);
            expect(wrapper.call(6.72, [3, 4])).to.closeTo(3.72, 0.001);

            const wrapper2 = transpiler
                .setSignature('sub', WebAssemblyType.FLOAT_64, WebAssemblyType.INT_32_ARRAY, WebAssemblyType.FLOAT_64)
                .transpile('function sub(a, b) { return a[0] - b; }');
            wrapper2.setFunctionName('sub');

            expect(wrapper2.call([1, 2], 2.45)).to.closeTo(-1.45, 0.001);
            expect(wrapper2.call([3, 4], 9.22)).to.closeTo(-6.22, 0.001);
        });

        it('should handle double multiplication', () => {
            const wrapper = transpiler
                .setSignature('mul', WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64)
                .transpile('function mul(a, b) { return a * b }');
            wrapper.setFunctionName('mul');

            expect(wrapper.call(3.45, 8.67)).to.closeTo(29.9115, 0.00001);
            expect(wrapper.call(-10.48, 2.21)).to.closeTo(-23.1608, 0.00001);
            expect(wrapper.call(5.29, 0.0)).to.closeTo(0.0, 0.01);
        });

        it('should handle double-int combination multiplication', () => {
            const content = 'function mul(a, b) { return a * b; }';
            const wrapper = transpiler
                .setSignature('mul', WebAssemblyType.FLOAT_64, WebAssemblyType.INT_32, WebAssemblyType.FLOAT_64)
                .transpile(content);
            wrapper.setFunctionName('mul');

            expect(wrapper.call(5, 14.9)).to.closeTo(74.5, 0.01);
            expect(wrapper.call(-100, 12.59)).to.closeTo(-1259, 0.001);
            expect(wrapper.call(20, -13.01)).to.closeTo(-260.2, 0.01);
            expect(wrapper.call(-9, -2.4)).to.closeTo(21.6, 0.01);

            const wrapper2 = new Transpiler()
                .setSignature('mul', WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64, WebAssemblyType.INT_32)
                .transpile(content);
            wrapper2.setFunctionName('mul');

            expect(wrapper2.call(5.31, 4)).to.closeTo(21.24, 0.001);
            expect(wrapper2.call(14.1, -3)).to.closeTo(-42.3, 0.01);
            expect(wrapper2.call(-23.4, 35)).to.closeTo(-819, 0.1);
            expect(wrapper2.call(-9.5, -2)).to.closeTo(19, 0.1);
        });

        it('should handle double multiplication with array', () => {
            const wrapper = transpiler
                .setSignature('mul', WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64, WebAssemblyType.INT_32_ARRAY)
                .transpile('function mul(a, b) { return a * b[0]; }');
            wrapper.setFunctionName('mul');

            expect(wrapper.call(1.13, [1, 2])).to.closeTo(1.13, 0.001);
            expect(wrapper.call(6.72, [3, 4])).to.closeTo(20.16, 0.001);

            const wrapper2 = transpiler
                .setSignature('mul', WebAssemblyType.FLOAT_64, WebAssemblyType.INT_32_ARRAY, WebAssemblyType.FLOAT_64)
                .transpile('function mul(a, b) { return a[0] * b; }');
            wrapper2.setFunctionName('mul');

            expect(wrapper2.call([1, 2], 2.45)).to.closeTo(2.45, 0.001);
            expect(wrapper2.call([3, 4], 9.22)).to.closeTo(27.66, 0.001);
        });

        it('should handle double division', () => {
            const wrapper = transpiler
                .setSignature('div', WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64)
                .transpile('function div(a, b) { return a / b }');
            wrapper.setFunctionName('div');

            expect(wrapper.call(1.67, 0.58)).to.closeTo(2.879310344827586, 0.000000000000001);
            expect(wrapper.call(-5.15, 2.1)).to.closeTo(-2.452380952380952, 0.000000000000001);
        });

        it('should handle double-int combination division', () => {
            const content = 'function div(a, b) { return a / b; }';
            const wrapper = transpiler
                .setSignature('div', WebAssemblyType.FLOAT_64, WebAssemblyType.INT_32, WebAssemblyType.FLOAT_64)
                .transpile(content);
            wrapper.setFunctionName('div');

            expect(wrapper.call(5, 14.9)).to.closeTo(0.3355704697986577, 0.000000000000001);
            expect(wrapper.call(-100, 12.59)).to.closeTo(-7.942811755361398, 0.000000000000001);
            expect(wrapper.call(20, -13.01)).to.closeTo(-1.53727901614143, 0.000000000000001);
            expect(wrapper.call(-9, -2.4)).to.closeTo(3.75, 0.001);

            const wrapper2 = new Transpiler()
                .setSignature('div', WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64, WebAssemblyType.INT_32)
                .transpile(content);
            wrapper2.setFunctionName('div');

            expect(wrapper2.call(5.31, 4)).to.closeTo(1.3275, 0.000001);
            expect(wrapper2.call(14.1, -3)).to.closeTo(-4.7, 0.01);
            expect(wrapper2.call(-23.4, 35)).to.closeTo(-0.6685714285714286, 0.000000000000001);
            expect(wrapper2.call(-9.5, -2)).to.closeTo(4.75, 0.001);
        });

        it('should handle double division with array', () => {
            const wrapper = transpiler
                .setSignature('div', WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64, WebAssemblyType.INT_32_ARRAY)
                .transpile('function div(a, b) { return a / b[0]; }');
            wrapper.setFunctionName('div');

            expect(wrapper.call(1.13, [1, 2])).to.closeTo(1.13, 0.001);
            expect(wrapper.call(6.72, [3, 4])).to.closeTo(2.24, 0.001);

            const wrapper2 = transpiler
                .setSignature('div', WebAssemblyType.FLOAT_64, WebAssemblyType.INT_32_ARRAY, WebAssemblyType.FLOAT_64)
                .transpile('function div(a, b) { return a[0] / b; }');
            wrapper2.setFunctionName('div');

            expect(wrapper2.call([1, 2], 2.45)).to.closeTo(0.4081632653061224, 0.000000000000001);
            expect(wrapper2.call([3, 4], 9.22)).to.closeTo(0.3253796095444685, 0.000000000000001);
        });

        it('should handle double division by 0', () => {
            const wrapper = transpiler
                .setSignature('div', WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64)
                .transpile('function div(a, b) { return a / b }');
            wrapper.setFunctionName('div');

            expect(wrapper.call(2.52, 0.0)).to.equal(Infinity);
            expect(wrapper.call(10.47, 0.0)).to.equal(Infinity);
        });

        it('should handle double modulo', () => {
            expect(() => transpiler
                .setSignature('mod', WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64)
                .transpile('function mod(a, b) { return a % b }')).to.throw();
        });

        it('should handle double equality', () => {
            const wrapper = transpiler
                .setSignature('eq', WebAssemblyType.BOOLEAN, WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64)
                .transpile('function eq(a, b) { return a == b }');
            wrapper.setFunctionName('eq');

            expect(wrapper.call(3.32, 3.32)).to.equal(true);
            expect(wrapper.call(3.22, 2.54)).to.equal(false);
        });

        it('should handle double-int combination equality', () => {
            const content = 'function eq(a, b) { return a == b; }';
            const wrapper = transpiler
                .setSignature('eq', WebAssemblyType.BOOLEAN, WebAssemblyType.INT_32, WebAssemblyType.FLOAT_64)
                .transpile(content);
            wrapper.setFunctionName('eq');

            expect(wrapper.call(1, 1)).to.equal(true);
            expect(wrapper.call(1, 1.1)).to.equal(false);

            const wrapper2 = new Transpiler()
                .setSignature('eq', WebAssemblyType.BOOLEAN, WebAssemblyType.FLOAT_64, WebAssemblyType.INT_32)
                .transpile(content);
            wrapper2.setFunctionName('eq');

            expect(wrapper2.call(2, 2)).to.equal(true);
            expect(wrapper2.call(2.1, 2)).to.equal(false);
        });

        it('should handle double equality with array', () => {
            const wrapper = transpiler
                .setSignature('eq', WebAssemblyType.BOOLEAN, WebAssemblyType.FLOAT_64, WebAssemblyType.INT_32_ARRAY)
                .transpile('function eq(a, b) { return a == b[0]; }');
            wrapper.setFunctionName('eq');

            expect(wrapper.call(1, [1, 2])).to.equal(true);
            expect(wrapper.call(1.1, [1, 2])).to.equal(false);

            const wrapper2 = transpiler
                .setSignature('eq', WebAssemblyType.BOOLEAN, WebAssemblyType.INT_32_ARRAY, WebAssemblyType.FLOAT_64)
                .transpile('function eq(a, b) { return a[1] == b; }');
            wrapper2.setFunctionName('eq');

            expect(wrapper2.call([1, 2], 2)).to.equal(true);
            expect(wrapper2.call([1, 2], 2.1)).to.equal(false);
        });

        it('should handle double inequality', () => {
            const wrapper = transpiler
                .setSignature('neq', WebAssemblyType.BOOLEAN, WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64)
                .transpile('function neq(a, b) { return a != b }');
            wrapper.setFunctionName('neq');

            expect(wrapper.call(3.32, 3.32)).to.equal(false);
            expect(wrapper.call(3.22, 2.54)).to.equal(true);
        });

        it('should handle double-int combination inequality', () => {
            const content = 'function neq(a, b) { return a != b; }';
            const wrapper = transpiler
                .setSignature('neq', WebAssemblyType.BOOLEAN, WebAssemblyType.INT_32, WebAssemblyType.FLOAT_64)
                .transpile(content);
            wrapper.setFunctionName('neq');

            expect(wrapper.call(3, 3)).to.equal(false);
            expect(wrapper.call(3, 3.1)).to.equal(true);

            const wrapper2 = new Transpiler()
                .setSignature('neq', WebAssemblyType.BOOLEAN, WebAssemblyType.FLOAT_64, WebAssemblyType.INT_32)
                .transpile(content);
            wrapper2.setFunctionName('neq');

            expect(wrapper2.call(4, 4)).to.equal(false);
            expect(wrapper2.call(4.1, 4)).to.equal(true);
        });

        it('should handle double inequality with array', () => {
            const wrapper = transpiler
                .setSignature('neq', WebAssemblyType.BOOLEAN, WebAssemblyType.FLOAT_64, WebAssemblyType.INT_32_ARRAY)
                .transpile('function neq(a, b) { return a != b[0]; }');
            wrapper.setFunctionName('neq');

            expect(wrapper.call(1, [1, 2])).to.equal(false);
            expect(wrapper.call(1.1, [1, 2])).to.equal(true);

            const wrapper2 = transpiler
                .setSignature('neq', WebAssemblyType.BOOLEAN, WebAssemblyType.INT_32_ARRAY, WebAssemblyType.FLOAT_64)
                .transpile('function neq(a, b) { return a[1] != b; }');
            wrapper2.setFunctionName('neq');

            expect(wrapper2.call([1, 2], 2)).to.equal(false);
            expect(wrapper2.call([1, 2], 2.1)).to.equal(true);
        });

        it('should handle double less than', () => {
            const wrapper = transpiler
                .setSignature('lt', WebAssemblyType.BOOLEAN, WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64)
                .transpile('function lt(a, b) { return a < b }');
            wrapper.setFunctionName('lt');

            expect(wrapper.call(3.3, 2.12)).to.equal(false);
            expect(wrapper.call(3.23, 3.23)).to.equal(false);
            expect(wrapper.call(3.14, 4.76)).to.equal(true);
            expect(wrapper.call(-3.51, -4.62)).to.equal(false);
            expect(wrapper.call(-4.1, -3.53)).to.equal(true);
        });

        it('should handle double-int combination less than', () => {
            const content = 'function lt(a, b) { return a < b; }';
            const wrapper = transpiler
                .setSignature('lt', WebAssemblyType.BOOLEAN, WebAssemblyType.INT_32, WebAssemblyType.FLOAT_64)
                .transpile(content);
            wrapper.setFunctionName('lt');

            expect(wrapper.call(5, 4.63)).to.equal(false);
            expect(wrapper.call(5, 5)).to.equal(false);
            expect(wrapper.call(5, 5.1)).to.equal(true);
            expect(wrapper.call(-5, -5.1)).to.equal(false);
            expect(wrapper.call(-5, -4.59)).to.equal(true);

            const wrapper2 = new Transpiler()
                .setSignature('lt', WebAssemblyType.BOOLEAN, WebAssemblyType.FLOAT_64, WebAssemblyType.INT_32)
                .transpile(content);
            wrapper2.setFunctionName('lt');

            expect(wrapper2.call(6.1, 6)).to.equal(false);
            expect(wrapper2.call(6, 6)).to.equal(false);
            expect(wrapper2.call(5.51, 6)).to.equal(true);
            expect(wrapper2.call(-5.39, -6)).to.equal(false);
            expect(wrapper2.call(-6.1, -6)).to.equal(true);
        });

        it('should handle double less than with array', () => {
            const wrapper = transpiler
                .setSignature('lt', WebAssemblyType.BOOLEAN, WebAssemblyType.FLOAT_64, WebAssemblyType.INT_32_ARRAY)
                .transpile('function lt(a, b) { return a < b[0]; }');
            wrapper.setFunctionName('lt');

            expect(wrapper.call(1.1, [1, 2])).to.equal(false);
            expect(wrapper.call(1, [1, 2])).to.equal(false);
            expect(wrapper.call(0.1, [1, 2])).to.equal(true);
            expect(wrapper.call(-0.1, [-1, -2])).to.equal(false);
            expect(wrapper.call(-1.1, [-1, -2])).to.equal(true);

            const wrapper2 = transpiler
                .setSignature('lt', WebAssemblyType.BOOLEAN, WebAssemblyType.INT_32_ARRAY, WebAssemblyType.FLOAT_64)
                .transpile('function lt(a, b) { return a[1] < b; }');
            wrapper2.setFunctionName('lt');

            expect(wrapper2.call([1, 2], 2.1)).to.equal(true);
            expect(wrapper2.call([1, 2], 2)).to.equal(false);
            expect(wrapper2.call([1, 2], 1.1)).to.equal(false);
            expect(wrapper2.call([-1, -2], -1.1)).to.equal(true);
            expect(wrapper2.call([-1, -2], -2.1)).to.equal(false);
        });

        it('should handle double less than or equal to', () => {
            const wrapper = transpiler
                .setSignature('le', WebAssemblyType.BOOLEAN, WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64)
                .transpile('function le(a, b) { return a <= b }');
            wrapper.setFunctionName('le');

            expect(wrapper.call(3.14, 2.51)).to.equal(false);
            expect(wrapper.call(3.62, 3.62)).to.equal(true);
            expect(wrapper.call(3.51, 4.29)).to.equal(true);
            expect(wrapper.call(-3.55, -4.19)).to.equal(false);
            expect(wrapper.call(-4.02, -3.38)).to.equal(true);
        });

        it('should handle double-int combination less than or equal to', () => {
            const content = 'function le(a, b) { return a <= b; }';
            const wrapper = transpiler
                .setSignature('le', WebAssemblyType.BOOLEAN, WebAssemblyType.INT_32, WebAssemblyType.FLOAT_64)
                .transpile(content);
            wrapper.setFunctionName('le');

            expect(wrapper.call(7, 6.63)).to.equal(false);
            expect(wrapper.call(7, 7)).to.equal(true);
            expect(wrapper.call(7, 7.1)).to.equal(true);
            expect(wrapper.call(-7, -7.1)).to.equal(false);
            expect(wrapper.call(-7, -6.59)).to.equal(true);

            const wrapper2 = new Transpiler()
                .setSignature('le', WebAssemblyType.BOOLEAN, WebAssemblyType.FLOAT_64, WebAssemblyType.INT_32)
                .transpile(content);
            wrapper2.setFunctionName('le');

            expect(wrapper2.call(8.51, 8)).to.equal(false);
            expect(wrapper2.call(8, 8)).to.equal(true);
            expect(wrapper2.call(7.51, 8)).to.equal(true);
            expect(wrapper2.call(-7.39, -8)).to.equal(false);
            expect(wrapper2.call(-8.1, -8)).to.equal(true);
        });

        it('should handle double less than or equal to with array', () => {
            const wrapper = transpiler
                .setSignature('le', WebAssemblyType.BOOLEAN, WebAssemblyType.FLOAT_64, WebAssemblyType.INT_32_ARRAY)
                .transpile('function le(a, b) { return a <= b[0]; }');
            wrapper.setFunctionName('le');

            expect(wrapper.call(1.1, [1, 2])).to.equal(false);
            expect(wrapper.call(1, [1, 2])).to.equal(true);
            expect(wrapper.call(0.1, [1, 2])).to.equal(true);
            expect(wrapper.call(-0.1, [-1, -2])).to.equal(false);
            expect(wrapper.call(-1.1, [-1, -2])).to.equal(true);

            const wrapper2 = transpiler
                .setSignature('le', WebAssemblyType.BOOLEAN, WebAssemblyType.INT_32_ARRAY, WebAssemblyType.FLOAT_64)
                .transpile('function le(a, b) { return a[1] <= b; }');
            wrapper2.setFunctionName('le');

            expect(wrapper2.call([1, 2], 2.1)).to.equal(true);
            expect(wrapper2.call([1, 2], 2)).to.equal(true);
            expect(wrapper2.call([1, 2], 1.1)).to.equal(false);
            expect(wrapper2.call([-1, -2], -1.1)).to.equal(true);
            expect(wrapper2.call([-1, -2], -2.1)).to.equal(false);
        });

        it('should handle double greater than', () => {
            const wrapper = transpiler
                .setSignature('gt', WebAssemblyType.BOOLEAN, WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64)
                .transpile('function gt(a, b) { return a > b }');
            wrapper.setFunctionName('gt');

            expect(wrapper.call(3.49, 2.81)).to.equal(true);
            expect(wrapper.call(3.29, 3.29)).to.equal(false);
            expect(wrapper.call(3.52, 4.59)).to.equal(false);
            expect(wrapper.call(-3.72, -4.51)).to.equal(true);
            expect(wrapper.call(-4.03, -3.01)).to.equal(false);
        });

        it('should handle double-int combination greater than', () => {
            const content = 'function gt(a, b) { return a > b; }';
            const wrapper = transpiler
                .setSignature('gt', WebAssemblyType.BOOLEAN, WebAssemblyType.INT_32, WebAssemblyType.FLOAT_64)
                .transpile(content);
            wrapper.setFunctionName('gt');

            expect(wrapper.call(9, 8.63)).to.equal(true);
            expect(wrapper.call(9, 9)).to.equal(false);
            expect(wrapper.call(9, 9.1)).to.equal(false);
            expect(wrapper.call(-9, -9.1)).to.equal(true);
            expect(wrapper.call(-9, -8.59)).to.equal(false);

            const wrapper2 = new Transpiler()
                .setSignature('gt', WebAssemblyType.BOOLEAN, WebAssemblyType.FLOAT_64, WebAssemblyType.INT_32)
                .transpile(content);
            wrapper2.setFunctionName('gt');

            expect(wrapper2.call(10.51, 10)).to.equal(true);
            expect(wrapper2.call(10, 10)).to.equal(false);
            expect(wrapper2.call(9.51, 10)).to.equal(false);
            expect(wrapper2.call(-9.39, -10)).to.equal(true);
            expect(wrapper2.call(-10.1, -10)).to.equal(false);
        });

        it('should handle double greater than with array', () => {
            const wrapper = transpiler
                .setSignature('gt', WebAssemblyType.BOOLEAN, WebAssemblyType.FLOAT_64, WebAssemblyType.INT_32_ARRAY)
                .transpile('function gt(a, b) { return a > b[0]; }');
            wrapper.setFunctionName('gt');

            expect(wrapper.call(1.1, [1, 2])).to.equal(true);
            expect(wrapper.call(1, [1, 2])).to.equal(false);
            expect(wrapper.call(0.1, [1, 2])).to.equal(false);
            expect(wrapper.call(-0.1, [-1, -2])).to.equal(true);
            expect(wrapper.call(-1.1, [-1, -2])).to.equal(false);

            const wrapper2 = transpiler
                .setSignature('gt', WebAssemblyType.BOOLEAN, WebAssemblyType.INT_32_ARRAY, WebAssemblyType.FLOAT_64)
                .transpile('function gt(a, b) { return a[1] > b; }');
            wrapper2.setFunctionName('gt');

            expect(wrapper2.call([1, 2], 2.1)).to.equal(false);
            expect(wrapper2.call([1, 2], 2)).to.equal(false);
            expect(wrapper2.call([1, 2], 1.1)).to.equal(true);
            expect(wrapper2.call([-1, -2], -1.1)).to.equal(false);
            expect(wrapper2.call([-1, -2], -2.1)).to.equal(true);
        });

        it('should handle double greater than or equal to', () => {
            const wrapper = transpiler
                .setSignature('ge', WebAssemblyType.BOOLEAN, WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64)
                .transpile('function ge(a, b) { return a >= b }');
            wrapper.setFunctionName('ge');

            expect(wrapper.call(3.42, 2.93)).to.equal(true);
            expect(wrapper.call(3.32, 3.32)).to.equal(true);
            expect(wrapper.call(3.07, 4.82)).to.equal(false);
            expect(wrapper.call(-3.19, -4.42)).to.equal(true);
            expect(wrapper.call(-4.37, -3.65)).to.equal(false);
        });

        it('should handle double-int combination greater than or equal to', () => {
            const content = 'function ge(a, b) { return a >= b; }';
            const wrapper = transpiler
                .setSignature('ge', WebAssemblyType.BOOLEAN, WebAssemblyType.INT_32, WebAssemblyType.FLOAT_64)
                .transpile(content);
            wrapper.setFunctionName('ge');

            expect(wrapper.call(11, 10.63)).to.equal(true);
            expect(wrapper.call(11, 11)).to.equal(true);
            expect(wrapper.call(11, 11.1)).to.equal(false);
            expect(wrapper.call(-11, -11.1)).to.equal(true);
            expect(wrapper.call(-11, -10.59)).to.equal(false);

            const wrapper2 = new Transpiler()
                .setSignature('ge', WebAssemblyType.BOOLEAN, WebAssemblyType.FLOAT_64, WebAssemblyType.INT_32)
                .transpile(content);
            wrapper2.setFunctionName('ge');

            expect(wrapper2.call(12.51, 12)).to.equal(true);
            expect(wrapper2.call(12, 12)).to.equal(true);
            expect(wrapper2.call(11.51, 12)).to.equal(false);
            expect(wrapper2.call(-11.39, -12)).to.equal(true);
            expect(wrapper2.call(-12.1, -12)).to.equal(false);
        });

        it('should handle double greater than or equal to with array', () => {
            const wrapper = transpiler
                .setSignature('ge', WebAssemblyType.BOOLEAN, WebAssemblyType.FLOAT_64, WebAssemblyType.INT_32_ARRAY)
                .transpile('function ge(a, b) { return a >= b[0]; }');
            wrapper.setFunctionName('ge');

            expect(wrapper.call(1.1, [1, 2])).to.equal(true);
            expect(wrapper.call(1, [1, 2])).to.equal(true);
            expect(wrapper.call(0.1, [1, 2])).to.equal(false);
            expect(wrapper.call(-0.1, [-1, -2])).to.equal(true);
            expect(wrapper.call(-1.1, [-1, -2])).to.equal(false);

            const wrapper2 = transpiler
                .setSignature('ge', WebAssemblyType.BOOLEAN, WebAssemblyType.INT_32_ARRAY, WebAssemblyType.FLOAT_64)
                .transpile('function ge(a, b) { return a[1] >= b; }');
            wrapper2.setFunctionName('ge');

            expect(wrapper2.call([1, 2], 2.1)).to.equal(false);
            expect(wrapper2.call([1, 2], 2)).to.equal(true);
            expect(wrapper2.call([1, 2], 1.1)).to.equal(true);
            expect(wrapper2.call([-1, -2], -1.1)).to.equal(false);
            expect(wrapper2.call([-1, -2], -2.1)).to.equal(true);
        });

        it('should handle double expression statements', () => {
            const content = 'function add(a, b) { a + b; return a + b; }';
            const wrapper = transpiler
                .setSignature('add', WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64)
                .transpile(content);
            wrapper.setFunctionName('add');

            expect(wrapper.call(1.41, 2.15)).to.closeTo(3.56, 0.001);
            expect(wrapper.call(10.3, 2.15)).to.closeTo(12.45, 0.001);
            expect(wrapper.call(0.15, 123.76)).to.closeTo(123.91, 0.001);
            expect(wrapper.call(123.72, 0.88)).to.closeTo(124.6, 0.01);
            expect(wrapper.call(0.71, 0.2)).to.closeTo(0.91, 0.001);
            expect(wrapper.call(-20.48, -5.38)).to.closeTo(-25.86, 0.001);
        });

        it('should handle double shorthand addition', () => {
            const wrapper = transpiler
                .setSignature('add', WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64)
                .transpile('function add(a) { var x = 1.13; x += a; return x; }');
            wrapper.setFunctionName('add');

            expect(wrapper.call(2.41)).to.closeTo(3.54, 0.001);
            expect(wrapper.call(-2.1)).to.closeTo(-0.97, 0.001);
        });

        it('should handle double-int combination shorthand addition', () => {
            const wrapper = transpiler
                .setSignature('add', WebAssemblyType.FLOAT_64, WebAssemblyType.INT_32)
                .transpile('function add(a) { var x = 1.13; x += a; return x; }');
            wrapper.setFunctionName('add');

            expect(wrapper.call(5)).to.closeTo(6.13, 0.001);
            expect(wrapper.call(-100)).to.closeTo(-98.87, 0.001);

            const wrapper2 = new Transpiler()
                .setSignature('add', WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64)
                .transpile('function add(a) { var x = 3; a += x; return a; }');
            wrapper2.setFunctionName('add');

            expect(wrapper2.call(14.1)).to.closeTo(17.1, 0.01);
            expect(wrapper2.call(-23.4)).to.closeTo(-20.4, 0.01);
        });

        it('should handle double shorthand addition with array', () => {
            const wrapper = transpiler
                .setSignature('add', WebAssemblyType.FLOAT_64, WebAssemblyType.INT_32_ARRAY)
                .transpile('function add(a) { var x = 1.13; x += a[0]; return x; }');
            wrapper.setFunctionName('add');

            expect(wrapper.call([1, 2])).to.closeTo(2.13, 0.001);
        });

        it('should handle double shorthand subtraction', () => {
            const wrapper = transpiler
                .setSignature('sub', WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64)
                .transpile('function sub(a) { var x = 1.13; x -= a; return x; }');
            wrapper.setFunctionName('sub');

            expect(wrapper.call(1.41)).to.closeTo(-0.28, 0.001);
            expect(wrapper.call(-20.14)).to.closeTo(21.27, 0.001);
        });

        it('should handle double-int combination shorthand subtraction', () => {
            const wrapper = transpiler
                .setSignature('sub', WebAssemblyType.FLOAT_64, WebAssemblyType.INT_32)
                .transpile('function sub(a) { var x = 1.13; x -= a; return x; }');
            wrapper.setFunctionName('sub');

            expect(wrapper.call(5)).to.closeTo(-3.87, 0.001);
            expect(wrapper.call(-100)).to.closeTo(101.13, 0.001);

            const wrapper2 = new Transpiler()
                .setSignature('sub', WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64)
                .transpile('function sub(a) { var x = 3; a -= x; return a; }');
            wrapper2.setFunctionName('sub');

            expect(wrapper2.call(5.31)).to.closeTo(2.31, 0.001);
            expect(wrapper2.call(-23.4)).to.closeTo(-26.4, 0.01);
        });

        it('should handle double shorthand subtraction with array', () => {
            const wrapper = transpiler
                .setSignature('sub', WebAssemblyType.FLOAT_64, WebAssemblyType.INT_32_ARRAY)
                .transpile('function sub(a) { var x = 1.13; x -= a[0]; return x; }');
            wrapper.setFunctionName('sub');

            expect(wrapper.call([1, 2])).to.closeTo(0.13, 0.001);
        });

        it('should handle double shorthand multiplication', () => {
            const wrapper = transpiler
                .setSignature('mul', WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64)
                .transpile('function mul(a) { var x = 1.13; x *= a; return x; }');
            wrapper.setFunctionName('mul');

            expect(wrapper.call(3.45)).to.closeTo(3.8985, 0.00001);
            expect(wrapper.call(-10.48)).to.closeTo(-11.8424, 0.00001);
        });

        it('should handle double-int combination shorthand multiplication', () => {
            const wrapper = transpiler
                .setSignature('mul', WebAssemblyType.FLOAT_64, WebAssemblyType.INT_32)
                .transpile('function mul(a) { var x = 1.13; x *= a; return x; }');
            wrapper.setFunctionName('mul');

            expect(wrapper.call(5)).to.closeTo(5.65, 0.001);
            expect(wrapper.call(-100)).to.closeTo(-113, 0.1);

            const wrapper2 = new Transpiler()
                .setSignature('mul', WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64)
                .transpile('function mul(a) { var x = 3; a *= x; return a; }');
            wrapper2.setFunctionName('mul');

            expect(wrapper2.call(5.31)).to.closeTo(15.93, 0.001);
            expect(wrapper2.call(-23.4)).to.closeTo(-70.2, 0.01);
        });

        it('should handle double shorthand multiplication with array', () => {
            const wrapper = transpiler
                .setSignature('mul', WebAssemblyType.FLOAT_64, WebAssemblyType.INT_32_ARRAY)
                .transpile('function mul(a) { var x = 1.13; x *= a[0]; return x; }');
            wrapper.setFunctionName('mul');

            expect(wrapper.call([2, 3])).to.closeTo(2.26, 0.001);
        });

        it('should handle double shorthand division', () => {
            const wrapper = transpiler
                .setSignature('div', WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64)
                .transpile('function div(a) { var x = 1.13; x /= a; return x; }');
            wrapper.setFunctionName('div');

            expect(wrapper.call(1.67)).to.closeTo(0.6766467065868263, 0.000000000000001);
            expect(wrapper.call(-5.15)).to.closeTo(-0.2194174757281553, 0.000000000000001);
        });

        it('should handle double-int combination shorthand division', () => {
            const wrapper = transpiler
                .setSignature('div', WebAssemblyType.FLOAT_64, WebAssemblyType.INT_32)
                .transpile('function div(a) { var x = 1.13; x /= a; return x; }');
            wrapper.setFunctionName('div');

            expect(wrapper.call(5)).to.closeTo(0.226, 0.0001);
            expect(wrapper.call(-100)).to.closeTo(-0.0113, 0.00001);

            const wrapper2 = new Transpiler()
                .setSignature('div', WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64)
                .transpile('function div(a) { var x = 3; a /= x; return a; }');
            wrapper2.setFunctionName('div');

            expect(wrapper2.call(5.31)).to.closeTo(1.77, 0.001);
            expect(wrapper2.call(-23.4)).to.closeTo(-7.8, 0.01);
        });

        it('should handle double shorthand division with array', () => {
            const wrapper = transpiler
                .setSignature('div', WebAssemblyType.FLOAT_64, WebAssemblyType.INT_32_ARRAY)
                .transpile('function div(a) { var x = 1.13; x /= a[0]; return x; }');
            wrapper.setFunctionName('div');

            expect(wrapper.call([2, 3])).to.closeTo(0.565, 0.0001);
        });
    });
});
