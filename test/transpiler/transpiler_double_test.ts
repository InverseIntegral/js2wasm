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

            expect(wrapper.setFunctionName('double').call()).to.equal(1.34);
        });

        it('should handle double parameter', () => {
            const wrapper = transpiler
                .setSignature('double', WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64)
                .transpile('function double(value) { return value; } ');

            expect(wrapper.setFunctionName('double').call(3.14)).to.equal(3.14);
            expect(wrapper.setFunctionName('double').call(2.52)).to.equal(2.52);
        });

        it('should handle double parameter with integer values', () => {
            const wrapper = transpiler
                .setSignature('double', WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64)
                .transpile('function double(value) { return value; } ');

            expect(wrapper.setFunctionName('double').call(9)).to.equal(9);
            expect(wrapper.setFunctionName('double').call(-5)).to.equal(-5);
            expect(wrapper.setFunctionName('double').call(0)).to.equal(0);
            expect(wrapper.setFunctionName('double').call(-0)).to.equal(0);
        });

        it('should handle double variable declaration with direct assignment', () => {
            const wrapper = transpiler
                .setSignature('double', WebAssemblyType.FLOAT_64)
                .transpile('function double() { var value = 5.3113; return value; } ');

            expect(wrapper.setFunctionName('double').call()).to.equal(5.3113);
        });

        it('should handle double variable declaration without direct assignment', () => {
            const wrapper = transpiler
                .setSignature('double', WebAssemblyType.FLOAT_64)
                .transpile('function double() { var value; value = 5.3113; return value; } ');

            expect(wrapper.setFunctionName('double').call()).to.equal(5.3113);
        });

        it('should handle double unary plus', () => {
            const wrapper = transpiler
                .setSignature('double', WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64)
                .transpile('function double(a) { return +a; }');
            wrapper.setFunctionName('double');

            expect(wrapper.call(31.412)).to.equal(31.412);
            expect(wrapper.call(-231.4129)).to.equal(-231.4129);
            expect(wrapper.call(0.0)).to.equal(0.0);
        });

        it('should handle double unary minus', () => {
            const wrapper = transpiler
                .setSignature('double', WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64)
                .transpile('function double(a) { return -a ; }');
            wrapper.setFunctionName('double');

            expect(wrapper.call(132.319)).to.equal(-132.319);
            expect(wrapper.call(-18.95)).to.equal(18.95);
            expect(wrapper.call(0.0)).to.equal(0.0);
            expect(wrapper.call(-0.0)).to.equal(0.0);
        });

        it('should handle multiple consecutive double unary operators', () => {
            const wrapper = transpiler
                .setSignature('double', WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64)
                .transpile('function double(a) { return -+-+-a; }');
            wrapper.setFunctionName('double');

            expect(wrapper.call(2.12)).to.equal(-2.12);
            expect(wrapper.call(-9.49)).to.equal(9.49);
        });

        it('should handle double pre increment', () => {
            const content = 'function preInc(a) { ++a; return a; }';
            const wrapper = transpiler
                .setSignature('preInc', WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64)
                .transpile(content);

            expect(wrapper.setFunctionName('preInc').call(12.34)).to.equal(13.34);
            expect(wrapper.setFunctionName('preInc').call(4.93)).to.equal(5.93);
        });

        it('should handle double post increment', () => {
            const content = 'function postInc(a) { a++; return a; }';
            const wrapper = transpiler
                .setSignature('postInc', WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64)
                .transpile(content);

            expect(wrapper.setFunctionName('postInc').call(4.92)).to.equal(5.92);
            expect(wrapper.setFunctionName('postInc').call(7.26)).to.equal(8.26);
        });

        it('should handle double pre decrement', () => {
            const content = 'function preDec(a) { --a; return a; }';
            const wrapper = transpiler
                .setSignature('preDec', WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64)
                .transpile(content);

            expect(wrapper.setFunctionName('preDec').call(93.89)).to.equal(92.89);
            expect(wrapper.setFunctionName('preDec').call(5.44)).to.equal(4.44);
        });

        it('should handle double post decrement', () => {
            const content = 'function postDec(a) { a--; return a; }';
            const wrapper = transpiler
                .setSignature('postDec', WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64)
                .transpile(content);

            expect(wrapper.setFunctionName('postDec').call(28.19)).to.equal(27.19);
            expect(wrapper.setFunctionName('postDec').call(16.35)).to.closeTo(15.35, 0.001);
        });

        it('should handle double addition', () => {
            const wrapper = transpiler
                .setSignature('add', WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64)
                .transpile('function add(a, b) { return a + b; }');
            wrapper.setFunctionName('add');

            expect(wrapper.call(1.13, 2.41)).to.equal(3.54);
            expect(wrapper.call(-100.53, 2.1)).to.equal(-98.43);
        });

        it('should handle double addition parameter and literal', () => {
            const wrapper = transpiler
                .setSignature('add', WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64)
                .transpile('function add(a) { return a + 3.48; }');
            wrapper.setFunctionName('add');

            expect(wrapper.call(6.81)).to.equal(10.29);
            expect(wrapper.call(11.76)).to.equal(15.24);
            expect(wrapper.call(-31.23)).to.equal(-27.75);

            const wrapper2 = new Transpiler()
                .setSignature('add', WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64)
                .transpile('function add(a) { return 5.79 + a; }');
            wrapper2.setFunctionName('add');

            expect(wrapper2.call(9.22)).to.closeTo(15.01, 0.001);
            expect(wrapper2.call(4.63)).to.equal(10.42);
            expect(wrapper2.call(-6.15)).to.closeTo(-0.36, 0.001);
        });

        it('should handle double-int combination addition', () => {
            const content = 'function add(a, b) { return a + b; }';
            const wrapper = transpiler
                .setSignature('add', WebAssemblyType.FLOAT_64, WebAssemblyType.INT_32, WebAssemblyType.FLOAT_64)
                .transpile(content);
            wrapper.setFunctionName('add');

            expect(wrapper.call(5, 14.9)).to.equal(19.9);
            expect(wrapper.call(-100, 12.59)).to.equal(-87.41);
            expect(wrapper.call(20, -13.01)).to.equal(6.99);
            expect(wrapper.call(-9, -2.4)).to.equal(-11.4);

            const wrapper2 = new Transpiler()
                .setSignature('add', WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64, WebAssemblyType.INT_32)
                .transpile(content);
            wrapper2.setFunctionName('add');

            expect(wrapper2.call(5.31, 4)).to.closeTo(9.31, 0.001);
            expect(wrapper2.call(14.1, -3)).to.equal(11.1);
            expect(wrapper2.call(-23.4, 35)).to.closeTo(11.6, 0.01);
            expect(wrapper2.call(-9.5, -2)).to.equal(-11.5);
        });

        it('should handle double addition with array', () => {
            const wrapper = transpiler
                .setSignature('add', WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64, WebAssemblyType.INT_32_ARRAY)
                .transpile('function add(a, b) { return a + b[0]; }');
            wrapper.setFunctionName('add');

            expect(wrapper.call(1.13, [1, 2])).to.equal(2.13);
            expect(wrapper.call(6.72, [3, 4])).to.closeTo(9.72, 0.001);
            expect(wrapper.call(-3.72, [5, 6])).to.closeTo(1.28, 0.001);
            expect(wrapper.call(-2.93, [-7, -8])).to.equal(-9.93);

            const wrapper2 = transpiler
                .setSignature('add', WebAssemblyType.FLOAT_64, WebAssemblyType.INT_32_ARRAY, WebAssemblyType.FLOAT_64)
                .transpile('function add(a, b) { return a[0] + b; }');
            wrapper2.setFunctionName('add');

            expect(wrapper2.call([1, 2], 2.45)).to.equal(3.45);
            expect(wrapper2.call([3, 4], 9.22)).to.equal(12.22);
            expect(wrapper2.call([5, 6], -31.24)).to.equal(-26.24);
            expect(wrapper2.call([-7, -8], -4.84)).to.equal(-11.84);
        });

        it('should handle double subtraction', () => {
            const wrapper = transpiler
                .setSignature('sub', WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64)
                .transpile('function sub(a, b) { return a - b; }');
            wrapper.setFunctionName('sub');

            expect(wrapper.call(1.41, 2.14)).to.closeTo(-0.73, 0.001);
            expect(wrapper.call(-20.145, 20.145)).to.equal(-40.29);
        });

        it('should handle double subtraction parameter and literal', () => {
            const wrapper = transpiler
                .setSignature('sub', WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64)
                .transpile('function sub(a) { return a - 3.48; }');
            wrapper.setFunctionName('sub');

            expect(wrapper.call(6.81)).to.closeTo(3.33, 0.001);
            expect(wrapper.call(11.76)).to.equal(8.28);
            expect(wrapper.call(-31.23)).to.equal(-34.71);

            const wrapper2 = new Transpiler()
                .setSignature('sub', WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64)
                .transpile('function sub(a) { return 5.79 - a; }');
            wrapper2.setFunctionName('sub');

            expect(wrapper2.call(9.22)).to.closeTo(-3.43, 0.001);
            expect(wrapper2.call(4.63)).to.closeTo(1.16, 0.001);
            expect(wrapper2.call(-6.15)).to.closeTo(11.94, 0.001);
        });

        it('should handle double-int combination subtraction', () => {
            const content = 'function sub(a, b) { return a - b; }';
            const wrapper = transpiler
                .setSignature('sub', WebAssemblyType.FLOAT_64, WebAssemblyType.INT_32, WebAssemblyType.FLOAT_64)
                .transpile(content);
            wrapper.setFunctionName('sub');

            expect(wrapper.call(5, 14.9)).to.equal(-9.9);
            expect(wrapper.call(-100, 12.59)).to.equal(-112.59);
            expect(wrapper.call(20, -13.01)).to.equal(33.01);
            expect(wrapper.call(-9, -2.4)).to.equal(-6.6);

            const wrapper2 = new Transpiler()
                .setSignature('sub', WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64, WebAssemblyType.INT_32)
                .transpile(content);
            wrapper2.setFunctionName('sub');

            expect(wrapper2.call(5.31, 4)).to.closeTo(1.31, 0.001);
            expect(wrapper2.call(14.1, -3)).to.equal(17.1);
            expect(wrapper2.call(-23.4, 35)).to.equal(-58.4);
            expect(wrapper2.call(-9.5, -2)).to.equal(-7.5);
        });

        it('should handle double subtraction with array', () => {
            const wrapper = transpiler
                .setSignature('sub', WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64, WebAssemblyType.INT_32_ARRAY)
                .transpile('function sub(a, b) { return a - b[0]; }');
            wrapper.setFunctionName('sub');

            expect(wrapper.call(1.13, [1, 2])).to.closeTo(0.13, 0.001);
            expect(wrapper.call(6.72, [3, 4])).to.closeTo(3.72, 0.001);
            expect(wrapper.call(-3.72, [5, 6])).to.equal(-8.72);
            expect(wrapper.call(-2.93, [-7, -8])).to.equal(4.07);

            const wrapper2 = transpiler
                .setSignature('sub', WebAssemblyType.FLOAT_64, WebAssemblyType.INT_32_ARRAY, WebAssemblyType.FLOAT_64)
                .transpile('function sub(a, b) { return a[0] - b; }');
            wrapper2.setFunctionName('sub');

            expect(wrapper2.call([1, 2], 2.45)).to.closeTo(-1.45, 0.001);
            expect(wrapper2.call([3, 4], 9.22)).to.closeTo(-6.22, 0.001);
            expect(wrapper2.call([5, 6], -31.24)).to.closeTo(36.24, 0.001);
            expect(wrapper2.call([-7, -8], -4.84)).to.equal(-2.16);
        });

        it('should handle double multiplication', () => {
            const wrapper = transpiler
                .setSignature('mul', WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64)
                .transpile('function mul(a, b) { return a * b }');
            wrapper.setFunctionName('mul');

            expect(wrapper.call(3.45, 8.67)).to.equal(29.9115);
            expect(wrapper.call(-10.48, 2.21)).to.closeTo(-23.1608, 0.00001);
            expect(wrapper.call(5.29, 0.0)).to.equal(0.0);
        });

        it('should handle double multiplication parameter and literal', () => {
            const wrapper = transpiler
                .setSignature('mul', WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64)
                .transpile('function mul(a) { return a * 3.48; }');
            wrapper.setFunctionName('mul');

            expect(wrapper.call(6.81)).to.equal(23.6988);
            expect(wrapper.call(11.76)).to.equal(40.9248);
            expect(wrapper.call(-31.23)).to.equal(-108.6804);

            const wrapper2 = new Transpiler()
                .setSignature('mul', WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64)
                .transpile('function mul(a) { return 5.79 * a; }');
            wrapper2.setFunctionName('mul');

            expect(wrapper2.call(9.22)).to.equal(53.3838);
            expect(wrapper2.call(4.63)).to.equal(26.8077);
            expect(wrapper2.call(-6.15)).to.equal(-35.6085);
        });

        it('should handle double-int combination multiplication', () => {
            const content = 'function mul(a, b) { return a * b; }';
            const wrapper = transpiler
                .setSignature('mul', WebAssemblyType.FLOAT_64, WebAssemblyType.INT_32, WebAssemblyType.FLOAT_64)
                .transpile(content);
            wrapper.setFunctionName('mul');

            expect(wrapper.call(5, 14.9)).to.equal(74.5);
            expect(wrapper.call(-100, 12.59)).to.equal(-1259);
            expect(wrapper.call(20, -13.01)).to.equal(-260.2);
            expect(wrapper.call(-9, -2.4)).to.closeTo(21.6, 0.01);

            const wrapper2 = new Transpiler()
                .setSignature('mul', WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64, WebAssemblyType.INT_32)
                .transpile(content);
            wrapper2.setFunctionName('mul');

            expect(wrapper2.call(5.31, 4)).to.equal(21.24);
            expect(wrapper2.call(14.1, -3)).to.equal(-42.3);
            expect(wrapper2.call(-23.4, 35)).to.equal(-819);
            expect(wrapper2.call(-9.5, -2)).to.equal(19);
        });

        it('should handle double multiplication with array', () => {
            const wrapper = transpiler
                .setSignature('mul', WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64, WebAssemblyType.INT_32_ARRAY)
                .transpile('function mul(a, b) { return a * b[0]; }');
            wrapper.setFunctionName('mul');

            expect(wrapper.call(1.13, [1, 2])).to.equal(1.13);
            expect(wrapper.call(6.72, [3, 4])).to.equal(20.16);
            expect(wrapper.call(-3.72, [5, 6])).to.equal(-18.6);
            expect(wrapper.call(-2.93, [-7, -8])).to.equal(20.51);

            const wrapper2 = transpiler
                .setSignature('mul', WebAssemblyType.FLOAT_64, WebAssemblyType.INT_32_ARRAY, WebAssemblyType.FLOAT_64)
                .transpile('function mul(a, b) { return a[0] * b; }');
            wrapper2.setFunctionName('mul');

            expect(wrapper2.call([1, 2], 2.45)).to.equal(2.45);
            expect(wrapper2.call([3, 4], 9.22)).to.closeTo(27.66, 0.001);
            expect(wrapper2.call([5, 6], -31.24)).to.equal(-156.2);
            expect(wrapper2.call([-7, -8], -4.84)).to.closeTo(33.88, 0.001);
        });

        it('should handle double division', () => {
            const wrapper = transpiler
                .setSignature('div', WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64)
                .transpile('function div(a, b) { return a / b }');
            wrapper.setFunctionName('div');

            expect(wrapper.call(1.67, 0.58)).to.closeTo(2.879310344827586, 0.000000000000001);
            expect(wrapper.call(-5.15, 2.1)).to.closeTo(-2.452380952380952, 0.000000000000001);
        });

        it('should handle double division parameter and literal', () => {
            const wrapper = transpiler
                .setSignature('div', WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64)
                .transpile('function div(a) { return a / 3.48; }');
            wrapper.setFunctionName('div');

            expect(wrapper.call(6.81)).to.equal(1.956896551724138);
            expect(wrapper.call(11.76)).to.closeTo(3.379310344827586, 0.000000000000001);
            expect(wrapper.call(-31.23)).to.equal(-8.974137931034483);

            const wrapper2 = new Transpiler()
                .setSignature('div', WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64)
                .transpile('function div(a) { return 5.79 / a; }');
            wrapper2.setFunctionName('div');

            expect(wrapper2.call(9.22)).to.closeTo(0.6279826464208243, 0.000000000000001);
            expect(wrapper2.call(4.63)).to.closeTo(1.250539956803456, 0.000000000000001);
            expect(wrapper2.call(-6.15)).to.equal(-0.9414634146341463);
        });

        it('should handle double-int combination division', () => {
            const content = 'function div(a, b) { return a / b; }';
            const wrapper = transpiler
                .setSignature('div', WebAssemblyType.FLOAT_64, WebAssemblyType.INT_32, WebAssemblyType.FLOAT_64)
                .transpile(content);
            wrapper.setFunctionName('div');

            expect(wrapper.call(5, 14.9)).to.closeTo(0.3355704697986577, 0.000000000000001);
            expect(wrapper.call(-100, 12.59)).to.equal(-7.942811755361398);
            expect(wrapper.call(20, -13.01)).to.closeTo(-1.53727901614143, 0.000000000000001);
            expect(wrapper.call(-9, -2.4)).to.equal(3.75);

            const wrapper2 = new Transpiler()
                .setSignature('div', WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64, WebAssemblyType.INT_32)
                .transpile(content);
            wrapper2.setFunctionName('div');

            expect(wrapper2.call(5.31, 4)).to.equal(1.3275);
            expect(wrapper2.call(14.1, -3)).to.equal(-4.7);
            expect(wrapper2.call(-23.4, 35)).to.closeTo(-0.6685714285714286, 0.000000000000001);
            expect(wrapper2.call(-9.5, -2)).to.equal(4.75);
        });

        it('should handle double division with array', () => {
            const wrapper = transpiler
                .setSignature('div', WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64, WebAssemblyType.INT_32_ARRAY)
                .transpile('function div(a, b) { return a / b[0]; }');
            wrapper.setFunctionName('div');

            expect(wrapper.call(1.13, [1, 2])).to.equal(1.13);
            expect(wrapper.call(6.72, [3, 4])).to.closeTo(2.24, 0.001);
            expect(wrapper.call(-3.72, [5, 6])).to.equal(-0.744);
            expect(wrapper.call(-2.93, [-7, -8])).to.equal(0.4185714285714286);

            const wrapper2 = transpiler
                .setSignature('div', WebAssemblyType.FLOAT_64, WebAssemblyType.INT_32_ARRAY, WebAssemblyType.FLOAT_64)
                .transpile('function div(a, b) { return a[0] / b; }');
            wrapper2.setFunctionName('div');

            expect(wrapper2.call([1, 2], 2.45)).to.equal(0.4081632653061224);
            expect(wrapper2.call([3, 4], 9.22)).to.closeTo(0.3253796095444685, 0.000000000000001);
            expect(wrapper2.call([5, 6], -31.24)).to.closeTo(-0.1600512163892446, 0.000000000000001);
            expect(wrapper2.call([-7, -8], -4.84)).to.closeTo(1.446280991735537, 0.000000000000001);
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

        it('should handle double calculation equality', () => {
            const wrapper = transpiler
                .setSignature('func', WebAssemblyType.BOOLEAN)
                .transpile('function func() { return 0.1 + 0.1 + 0.1 == 0.3; }');
            wrapper.setFunctionName('func');

            expect(wrapper.call()).to.equal(false);
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
            expect(wrapper.call(123.72, 0.88)).to.equal(124.6);
            expect(wrapper.call(0.71, 0.2)).to.closeTo(0.91, 0.001);
            expect(wrapper.call(-20.48, -5.38)).to.equal(-25.86);
        });

        it('should handle double shorthand addition', () => {
            const wrapper = transpiler
                .setSignature('add', WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64)
                .transpile('function add(a) { var x = 1.13; x += a; return x; }');
            wrapper.setFunctionName('add');

            expect(wrapper.call(2.41)).to.equal(3.54);
            expect(wrapper.call(-2.1)).to.closeTo(-0.97, 0.001);
        });

        it('should handle double-int combination shorthand addition', () => {
            const wrapper = transpiler
                .setSignature('add', WebAssemblyType.FLOAT_64, WebAssemblyType.INT_32)
                .transpile('function add(a) { var x = 1.13; x += a; return x; }');
            wrapper.setFunctionName('add');

            expect(wrapper.call(5)).to.equal(6.13);
            expect(wrapper.call(-100)).to.equal(-98.87);

            const wrapper2 = new Transpiler()
                .setSignature('add', WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64)
                .transpile('function add(a) { var x = 3; a += x; return a; }');
            wrapper2.setFunctionName('add');

            expect(wrapper2.call(14.1)).to.equal(17.1);
            expect(wrapper2.call(-23.4)).to.equal(-20.4);
        });

        it('should handle double shorthand addition with array', () => {
            const wrapper = transpiler
                .setSignature('add', WebAssemblyType.FLOAT_64, WebAssemblyType.INT_32_ARRAY)
                .transpile('function add(a) { var x = 1.13; x += a[0]; return x; }');
            wrapper.setFunctionName('add');

            expect(wrapper.call([1, 2])).to.equal(2.13);
        });

        it('should handle double shorthand subtraction', () => {
            const wrapper = transpiler
                .setSignature('sub', WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64)
                .transpile('function sub(a) { var x = 1.13; x -= a; return x; }');
            wrapper.setFunctionName('sub');

            expect(wrapper.call(1.41)).to.equal(-0.28);
            expect(wrapper.call(-20.14)).to.equal(21.27);
        });

        it('should handle double-int combination shorthand subtraction', () => {
            const wrapper = transpiler
                .setSignature('sub', WebAssemblyType.FLOAT_64, WebAssemblyType.INT_32)
                .transpile('function sub(a) { var x = 1.13; x -= a; return x; }');
            wrapper.setFunctionName('sub');

            expect(wrapper.call(5)).to.equal(-3.87);
            expect(wrapper.call(-100)).to.equal(101.13);

            const wrapper2 = new Transpiler()
                .setSignature('sub', WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64)
                .transpile('function sub(a) { var x = 3; a -= x; return a; }');
            wrapper2.setFunctionName('sub');

            expect(wrapper2.call(5.31)).to.closeTo(2.31, 0.001);
            expect(wrapper2.call(-23.4)).to.equal(-26.4);
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

            expect(wrapper.call(3.45)).to.equal(3.8985);
            expect(wrapper.call(-10.48)).to.equal(-11.8424);
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

            expect(wrapper2.call(5.31)).to.equal(15.93);
            expect(wrapper2.call(-23.4)).to.closeTo(-70.2, 0.01);
        });

        it('should handle double shorthand multiplication with array', () => {
            const wrapper = transpiler
                .setSignature('mul', WebAssemblyType.FLOAT_64, WebAssemblyType.INT_32_ARRAY)
                .transpile('function mul(a) { var x = 1.13; x *= a[0]; return x; }');
            wrapper.setFunctionName('mul');

            expect(wrapper.call([2, 3])).to.equal(2.26);
        });

        it('should handle double shorthand division', () => {
            const wrapper = transpiler
                .setSignature('div', WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64)
                .transpile('function div(a) { var x = 1.13; x /= a; return x; }');
            wrapper.setFunctionName('div');

            expect(wrapper.call(1.67)).to.equal(0.6766467065868263);
            expect(wrapper.call(-5.15)).to.closeTo(-0.2194174757281553, 0.000000000000001);
        });

        it('should handle double-int combination shorthand division', () => {
            const wrapper = transpiler
                .setSignature('div', WebAssemblyType.FLOAT_64, WebAssemblyType.INT_32)
                .transpile('function div(a) { var x = 1.13; x /= a; return x; }');
            wrapper.setFunctionName('div');

            expect(wrapper.call(5)).to.closeTo(0.226, 0.0001);
            expect(wrapper.call(-100)).to.equal(-0.0113);

            const wrapper2 = new Transpiler()
                .setSignature('div', WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64)
                .transpile('function div(a) { var x = 3; a /= x; return a; }');
            wrapper2.setFunctionName('div');

            expect(wrapper2.call(5.31)).to.closeTo(1.77, 0.001);
            expect(wrapper2.call(-23.4)).to.equal(-7.8);
        });

        it('should handle double shorthand division with array', () => {
            const wrapper = transpiler
                .setSignature('div', WebAssemblyType.FLOAT_64, WebAssemblyType.INT_32_ARRAY)
                .transpile('function div(a) { var x = 1.13; x /= a[0]; return x; }');
            wrapper.setFunctionName('div');

            expect(wrapper.call([2, 3])).to.equal(0.565);
        });

        it('should handle double in if', () => {
            const content = 'function branch(a) { if (a == 29.02) { return true; } else { return false; } }';

            const wrapper = transpiler
                .setSignature('branch', WebAssemblyType.BOOLEAN, WebAssemblyType.FLOAT_64)
                .transpile(content);
            wrapper.setFunctionName('branch');

            expect(wrapper.call(29.02)).to.equal(true);
            expect(wrapper.call(4.89)).to.equal(false);
        });

        it('should handle double in else if', () => {
            const content = 'function branch(a) {' +
                'if (a == 7.42) { return 0; }' +
                'else if (a == 4.15) { return 1; }' +
                'else { return 2; } }';

            const wrapper = transpiler
                .setSignature('branch', WebAssemblyType.INT_32, WebAssemblyType.FLOAT_64)
                .transpile(content);
            wrapper.setFunctionName('branch');

            expect(wrapper.call(7.42)).to.equal(0);
            expect(wrapper.call(4.15)).to.equal(1);
            expect(wrapper.call(9.77)).to.equal(2);
        });

        it('should handle double in while loop', () => {
            const content = 'function loop(a) { var times = 0, i = 0; while (i < a) { i++; times++; } return times; }';
            const wrapper = transpiler
                .setSignature('loop', WebAssemblyType.INT_32, WebAssemblyType.FLOAT_64)
                .transpile(content);
            wrapper.setFunctionName('loop');

            expect(wrapper.call(3.53)).to.equal(4);
            expect(wrapper.call(-2.13)).to.equal(0);
        });

        it('should handle double in while loop with double index', () => {
            const content = 'function loop(a) {' +
                'var times = 0, i = 1.5;' +
                'while (i < a) { i++; times++; }' +
                'return times; }';
            const wrapper = transpiler
                .setSignature('loop', WebAssemblyType.INT_32, WebAssemblyType.FLOAT_64)
                .transpile(content);
            wrapper.setFunctionName('loop');

            expect(wrapper.call(2.51)).to.equal(2);
            expect(wrapper.call(2.5)).to.equal(1);
            expect(wrapper.call(1.5)).to.equal(0);
            expect(wrapper.call(-2.13)).to.equal(0);
        });

        it('should handle double in for loop', () => {
            const content = 'function loop() { var times = 0, i = 0;' +
                'for (var a = 4.21; i < a; i++) { times++; }' +
                'return times; }';

            const wrapper = transpiler
                .setSignature('loop', WebAssemblyType.INT_32)
                .transpile(content);
            wrapper.setFunctionName('loop');

            expect(wrapper.call()).to.equal(5);
        });

        it('should handle double parameter as function call parameter', () => {
            const content = 'function func(a) { return a; }' +
                'function main(a) { return func(a); }';
            const wrapper = transpiler
                .setSignature('main', WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64)
                .setSignature('func', WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64)
                .transpile(content);
            wrapper.setFunctionName('main');

            expect(wrapper.call(3.53)).to.equal(3.53);
            expect(wrapper.call(-32.13)).to.equal(-32.13);
        });

        it('should handle double variable as function call parameter', () => {
            const content = 'function func(a) { return a; }' +
                'function main() { var b = 8.49; return func(b); }';
            const wrapper = transpiler
                .setSignature('main', WebAssemblyType.FLOAT_64)
                .setSignature('func', WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64)
                .transpile(content);
            wrapper.setFunctionName('main');

            expect(wrapper.call()).to.equal(8.49);
        });

        it('should handle double literal as function call parameter', () => {
            const content = 'function func(a) { return a; }' +
                'function main() { return func(3.71); }';
            const wrapper = transpiler
                .setSignature('main', WebAssemblyType.FLOAT_64)
                .setSignature('func', WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64)
                .transpile(content);
            wrapper.setFunctionName('main');

            expect(wrapper.call()).to.equal(3.71);
        });

        it('should handle double int parameter as function call parameter', () => {
            const content = 'function func(a) { return a; }' +
                'function main(a) { return func(a); }';
            const wrapper = transpiler
                .setSignature('main', WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64)
                .setSignature('func', WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64)
                .transpile(content);
            wrapper.setFunctionName('main');

            expect(wrapper.call(3)).to.equal(3);
            expect(wrapper.call(-32)).to.equal(-32);
        });

        it('should handle double int variable as function call parameter', () => {
            const content = 'function func(a) { return a; }' +
                'function main() { var b = 8; return func(b); }';
            const wrapper = transpiler
                .setSignature('main', WebAssemblyType.FLOAT_64)
                .setSignature('func', WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64)
                .transpile(content);
            wrapper.setFunctionName('main');

            expect(wrapper.call()).to.equal(8);
        });

        it('should handle double int array as function call parameter', () => {
            const content = 'function func(a) { return a; }' +
                'function main(a) { return func(a[0]); }';
            const wrapper = transpiler
                .setSignature('main', WebAssemblyType.FLOAT_64, WebAssemblyType.INT_32_ARRAY)
                .setSignature('func', WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64)
                .transpile(content);
            wrapper.setFunctionName('main');

            expect(wrapper.call([1, 2])).to.equal(1);
            expect(wrapper.call([-3, -4])).to.equal(-3);
        });

        it('should handle double int literal as function call parameter', () => {
            const content = 'function func(a) { return a; }' +
                'function main() { return func(3); }';
            const wrapper = transpiler
                .setSignature('main', WebAssemblyType.FLOAT_64)
                .setSignature('func', WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64)
                .transpile(content);
            wrapper.setFunctionName('main');

            expect(wrapper.call()).to.equal(3);
        });

        it('should handle double expression as function call parameter', () => {
            const content = 'function func(a) { return a; }' +
                'function main() { return func(1.73 + 6.82); }';
            const wrapper = transpiler
                .setSignature('main', WebAssemblyType.FLOAT_64)
                .setSignature('func', WebAssemblyType.FLOAT_64, WebAssemblyType.FLOAT_64)
                .transpile(content);
            wrapper.setFunctionName('main');

            expect(wrapper.call()).to.equal(8.55);
        });

        it('should handle double function call return value in calculation', () => {
            const content = 'function func() { return 18.34; }' +
                'function main() { return 5.29 + func(); }';
            const wrapper = transpiler
                .setSignature('main', WebAssemblyType.FLOAT_64)
                .setSignature('func', WebAssemblyType.FLOAT_64)
                .transpile(content);
            wrapper.setFunctionName('main');

            expect(wrapper.call()).to.equal(23.63);
        });

        it('should handle double function call return value in declaration', () => {
            const content = 'function func() { return 8.73; }' +
                'function main() { var x = func(); return x; }';
            const wrapper = transpiler
                .setSignature('main', WebAssemblyType.FLOAT_64)
                .setSignature('func', WebAssemblyType.FLOAT_64)
                .transpile(content);
            wrapper.setFunctionName('main');

            expect(wrapper.call()).to.equal(8.73);
        });

        it('should handle double function call return value in assignment', () => {
            const content = 'function func() { return 1.67; }' +
                'function main() { var x; x = func(); return x; }';
            const wrapper = transpiler
                .setSignature('main', WebAssemblyType.FLOAT_64)
                .setSignature('func', WebAssemblyType.FLOAT_64)
                .transpile(content);
            wrapper.setFunctionName('main');

            expect(wrapper.call()).to.equal(1.67);
        });

        it('should handle double function call return value in shorthand assignment', () => {
            const content = 'function func() { return 4.82; }' +
                'function main() { var x = 5.23; x += func(); return x; }';
            const wrapper = transpiler
                .setSignature('main', WebAssemblyType.FLOAT_64)
                .setSignature('func', WebAssemblyType.FLOAT_64)
                .transpile(content);
            wrapper.setFunctionName('main');

            expect(wrapper.call()).to.equal(10.05);
        });
    });
});
