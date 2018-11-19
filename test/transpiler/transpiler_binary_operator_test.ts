import {expect} from 'chai';
import {WebAssemblyType} from '../../src/generator/wasm_type';
import Transpiler from '../../src/transpiler';

describe('Transpiler', () => {

    let transpiler: Transpiler;

    beforeEach(() => {
        transpiler = new Transpiler();
    });

    function createFunctionWithIntParameters(name: string, amount: number) {
        return new Map([[name, new Array(amount).fill(WebAssemblyType.INT_32)]]);
    }

    describe('#transpile()', () => {
        it('should handle addition', () => {
            const type = createFunctionWithIntParameters('add', 2);
            const wrapper = transpiler.transpile('function add(a, b) { return a + b; }', type);
            wrapper.setFunctionName('add');

            expect(wrapper.call(1, 2)).to.equal(3);
            expect(wrapper.call(100, 2)).to.equal(102);
            expect(wrapper.call(-20, 20)).to.equal(0);
        });

        it('should handle subtraction', () => {
            const type = createFunctionWithIntParameters('sub', 2);
            const wrapper = transpiler.transpile('function sub(a, b) { return a - b; }', type);
            wrapper.setFunctionName('sub');

            expect(wrapper.call(1, 2)).to.equal(-1);
            expect(wrapper.call(10, 2)).to.equal(8);
            expect(wrapper.call(-20, 20)).to.equal(-40);
        });

        it('should handle addition and subtraction', () => {
            const type = createFunctionWithIntParameters('addSub', 2);
            const wrapper = transpiler.transpile('function addSub(a, b) { return a + b - a; }', type);
            wrapper.setFunctionName('addSub');

            expect(wrapper.call(1, 2)).to.equal(2);
            expect(wrapper.call(100, 2)).to.equal(2);
            expect(wrapper.call(-20, 20)).to.equal(20);
        });

        it('should handle multiplication', () => {
            const type = createFunctionWithIntParameters('mul', 2);
            const wrapper = transpiler.transpile('function mul(a, b) { return a * b }', type);
            wrapper.setFunctionName('mul');

            expect(wrapper.call(1, 2)).to.equal(2);
            expect(wrapper.call(10, 2)).to.equal(20);
            expect(wrapper.call(-10, 2)).to.equal(-20);
        });

        it('should handle multiplication before addition', () => {
            const type = createFunctionWithIntParameters('mul', 3);
            const wrapper = transpiler.transpile('function mul(a, b, c) { return a + b * c }', type);

            expect(wrapper.setFunctionName('mul').call(3, 2, 5)).to.equal(13);
        });

        it('should handle multiplication before subtraction', () => {
            const type = createFunctionWithIntParameters('mul', 3);
            const wrapper = transpiler.transpile('function mul(a, b, c) { return a - b * c }', type);

            expect(wrapper.setFunctionName('mul').call(3, 2, 5)).to.equal(-7);
        });

        it('should handle division', () => {
            const type = createFunctionWithIntParameters('div', 2);
            const wrapper = transpiler.transpile('function div(a, b) { return a / b }', type);
            wrapper.setFunctionName('div');

            expect(wrapper.call(1, 2)).to.equal(0);
            expect(wrapper.call(10, 2)).to.equal(5);
            expect(wrapper.call(-10, 2)).to.equal(-5);
        });

        it('should handle division by 0', () => {
            const type = createFunctionWithIntParameters('div', 2);
            const wrapper = transpiler.transpile('function div(a, b) { return a / b }', type);
            wrapper.setFunctionName('div');

            expect(() => wrapper.call(2, 0)).to.throw();
            expect(() => wrapper.call(10, 0)).to.throw();
        });

        it('should handle division before addition', () => {
            const type = createFunctionWithIntParameters('div', 3);
            const wrapper = transpiler.transpile('function div(a, b, c) { return a + b / c }', type);

            expect(wrapper.setFunctionName('div').call(3, 10, 5)).to.equal(5);
        });

        it('should handle division before subtraction', () => {
            const type = createFunctionWithIntParameters('div', 3);
            const wrapper = transpiler.transpile('function div(a, b, c) { return a - b / c }', type);

            expect(wrapper.setFunctionName('div').call(3, 10, 5)).to.equal(1);
        });

        it('should handle modulo', () => {
            const type = createFunctionWithIntParameters('mod', 2);
            const wrapper = transpiler.transpile('function mod(a, b) { return a % b }', type);
            wrapper.setFunctionName('mod');

            expect(wrapper.call(1, 2)).to.equal(1);
            expect(wrapper.call(10, 2)).to.equal(0);
            expect(wrapper.call(-10, 2)).to.equal(0);
        });

        it('should handle modulo by 0', () => {
            const type = createFunctionWithIntParameters('mod', 2);
            const wrapper = transpiler.transpile('function mod(a, b) { return a % b }', type);
            wrapper.setFunctionName('mod');

            expect(() => wrapper.call(2, 0)).to.throw();
            expect(() => wrapper.call(10, 0)).to.throw();
        });

        it('should handle modulo before addition', () => {
            const type = createFunctionWithIntParameters('mod', 3);
            const wrapper = transpiler.transpile('function mod(a, b, c) { return a + b % c }', type);

            expect(wrapper.setFunctionName('mod').call(3, 10, 6)).to.equal(7);
        });

        it('should handle modulo before subtraction', () => {
            const type = createFunctionWithIntParameters('mod', 3);
            const wrapper = transpiler.transpile('function mod(a, b, c) { return a - b % c }', type);

            expect(wrapper.setFunctionName('mod').call(3, 10, 6)).to.equal(-1);
        });

        it('should handle equality', () => {
            const type = createFunctionWithIntParameters('eq', 2);
            const wrapper = transpiler.transpile('function eq(a, b) { return a == b }', type);
            wrapper.setFunctionName('eq');

            expect(wrapper.call(3, 3)).to.equal(1);
            expect(wrapper.call(3, 2)).to.equal(0);
        });

        it('should handle inequality', () => {
            const type = createFunctionWithIntParameters('neq', 2);
            const wrapper = transpiler.transpile('function neq(a, b) { return a != b }', type);
            wrapper.setFunctionName('neq');

            expect(wrapper.call(3, 2)).to.equal(1);
            expect(wrapper.call(3, 3)).to.equal(0);
        });

        it('should handle less than', () => {
            const type = createFunctionWithIntParameters('lt', 2);
            const wrapper = transpiler.transpile('function lt(a, b) { return a < b }', type);
            wrapper.setFunctionName('lt');

            expect(wrapper.call(3, 2)).to.equal(0);
            expect(wrapper.call(3, 3)).to.equal(0);
            expect(wrapper.call(3, 4)).to.equal(1);
            expect(wrapper.call(-3, -4)).to.equal(0);
            expect(wrapper.call(-4, -3)).to.equal(1);
        });

        it('should handle less than or equal to', () => {
            const type = createFunctionWithIntParameters('le', 2);
            const wrapper = transpiler.transpile('function le(a, b) { return a <= b }', type);
            wrapper.setFunctionName('le');

            expect(wrapper.call(3, 2)).to.equal(0);
            expect(wrapper.call(3, 3)).to.equal(1);
            expect(wrapper.call(3, 4)).to.equal(1);
            expect(wrapper.call(-3, -4)).to.equal(0);
            expect(wrapper.call(-4, -3)).to.equal(1);
        });

        it('should handle greater than', () => {
            const type = createFunctionWithIntParameters('gt', 2);
            const wrapper = transpiler.transpile('function gt(a, b) { return a > b }', type);
            wrapper.setFunctionName('gt');

            expect(wrapper.call(3, 2)).to.equal(1);
            expect(wrapper.call(3, 3)).to.equal(0);
            expect(wrapper.call(3, 4)).to.equal(0);
            expect(wrapper.call(-3, -4)).to.equal(1);
            expect(wrapper.call(-4, -3)).to.equal(0);
        });

        it('should handle greater than or equal to', () => {
            const type = createFunctionWithIntParameters('ge', 2);
            const wrapper = transpiler.transpile('function ge(a, b) { return a >= b }', type);
            wrapper.setFunctionName('ge');

            expect(wrapper.call(3, 2)).to.equal(1);
            expect(wrapper.call(3, 3)).to.equal(1);
            expect(wrapper.call(3, 4)).to.equal(0);
            expect(wrapper.call(-3, -4)).to.equal(1);
            expect(wrapper.call(-4, -3)).to.equal(0);
        });

        it('should handle parenthesis', () => {
            const type = createFunctionWithIntParameters('sub', 2);
            const wrapper = transpiler.transpile('function sub(a, b) { return (a + 3) - (b + 2); }', type);
            expect(wrapper.setFunctionName('sub').call(10, 2)).to.equal(9);
        });

        it('should handle logical and', () => {
            const type = new Map();
            type.set('and', [WebAssemblyType.BOOLEAN, WebAssemblyType.BOOLEAN]);

            const content = 'function and(a, b) { return a && b; }';
            const wrapper = transpiler.transpile(content, type);
            wrapper.setFunctionName('and');

            expect(wrapper.call(true, true)).to.equal(1);
            expect(wrapper.call(true, false)).to.equal(0);
            expect(wrapper.call(false, true)).to.equal(0);
            expect(wrapper.call(false, false)).to.equal(0);
        });

        it('should handle logical or', () => {
            const type = new Map();
            type.set('or', [WebAssemblyType.BOOLEAN, WebAssemblyType.BOOLEAN]);

            const content = 'function or(a, b) { return a || b; }';
            const wrapper = transpiler.transpile(content, type);
            wrapper.setFunctionName('or');

            expect(wrapper.call(true, true)).to.equal(1);
            expect(wrapper.call(true, false)).to.equal(1);
            expect(wrapper.call(false, true)).to.equal(1);
            expect(wrapper.call(false, false)).to.equal(0);
        });

        it('should handle multiple logical operators', () => {
            const type = new Map();
            type.set('logic', [WebAssemblyType.BOOLEAN, WebAssemblyType.BOOLEAN, WebAssemblyType.BOOLEAN]);

            const content = 'function logic(a, b, c) { return a || b && c; }';
            const wrapper = transpiler.transpile(content, type);
            wrapper.setFunctionName('logic');

            expect(wrapper.call(true, true, true)).to.equal(1);
            expect(wrapper.call(true, true, false)).to.equal(1);
            expect(wrapper.call(true, false, true)).to.equal(1);
            expect(wrapper.call(true, false, false)).to.equal(1);
            expect(wrapper.call(false, true, true)).to.equal(1);
            expect(wrapper.call(false, true, false)).to.equal(0);
            expect(wrapper.call(false, false, true)).to.equal(0);
            expect(wrapper.call(false, false, false)).to.equal(0);
        });

        it('should handle expression statements', () => {
            const type = createFunctionWithIntParameters('add', 2);
            const content = 'function add(a, b) { a + b; return a + b; }';
            const wrapper = transpiler.transpile(content, type);
            wrapper.setFunctionName('add');

            expect(wrapper.call(1, 2)).to.equal(3);
            expect(wrapper.call(10, 2)).to.equal(12);
            expect(wrapper.call(0, 123)).to.equal(123);
            expect(wrapper.call(123, 0)).to.equal(123);
            expect(wrapper.call(0, 0)).to.equal(0);
            expect(wrapper.call(-20, -5)).to.equal(-25);
        });
    });
});
