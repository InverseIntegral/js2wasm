import {expect} from 'chai';
import {WebAssemblyType} from '../../src/generator/wasm_type';
import Transpiler from '../../src/transpiler';

describe('Transpiler', () => {

    let transpiler: Transpiler;

    beforeEach(() => {
        transpiler = new Transpiler();
    });

    describe('#transpile()', () => {

        it('should handle plus shorthand assignment', () => {
            const type = new Map([['plusAssign', [WebAssemblyType.INT_32]]]);
            const content = 'function plusAssign(a) { var b = 1; b += a; return b; }';
            const wrapper = transpiler.transpile(content, type);
            wrapper.setFunctionName('plusAssign');

            expect(wrapper.call(5)).to.equal(6);
            expect(wrapper.call(-5)).to.equal(-4);
        });

        it('should handle minus shorthand assignment', () => {
            const type = new Map([['minusAssign', [WebAssemblyType.INT_32]]]);
            const content = 'function minusAssign(a) { var b = 1; b -= a; return b; }';
            const wrapper = transpiler.transpile(content, type);
            wrapper.setFunctionName('minusAssign');

            expect(wrapper.call(5)).to.equal(-4);
            expect(wrapper.call(-5)).to.equal(6);
        });

        it('should handle multiplication shorthand assignment', () => {
            const type = new Map([['multAssign', [WebAssemblyType.INT_32]]]);
            const content = 'function multAssign(a) { var b = 2; b *= a; return b; }';
            const wrapper = transpiler.transpile(content, type);
            wrapper.setFunctionName('multAssign');

            expect(wrapper.call(5)).to.equal(10);
            expect(wrapper.call(-5)).to.equal(-10);
        });

        it('should handle division shorthand assignment', () => {
            const type = new Map([['divAssign', [WebAssemblyType.INT_32]]]);
            const content = 'function divAssign(a) { var b = 10; b /= a; return b; }';
            const wrapper = transpiler.transpile(content, type);
            wrapper.setFunctionName('divAssign');

            expect(wrapper.call(5)).to.equal(2);
            expect(wrapper.call(-5)).to.equal(-2);
        });

        it('should handle a single variable', () => {
            const type = new Map([['variables', [WebAssemblyType.INT_32]]]);
            const content = 'function variables(a) { var x; x = 10; return x; }';
            const wrapper = transpiler.transpile(content, type);

            expect(wrapper.setFunctionName('variables').call(100)).to.equal(10);
        });

        it('should handle a single variable with direct assignment', () => {
            const type = new Map([['variables', [WebAssemblyType.INT_32]]]);
            const wrapper = transpiler.transpile('function variables(a) { var x; x = 10; return x; }', type);

            expect(wrapper.setFunctionName('variables').call(100)).to.equal(10);
        });

        it('should handle a single variable with direct assignment', () => {
            const type = new Map([['variables', [WebAssemblyType.INT_32]]]);
            const wrapper = transpiler.transpile('function variables() { var x = 10; return x; }', type);

            expect(wrapper.setFunctionName('variables').call()).to.equal(10);
        });

        it('should handle multiple variables', () => {
            const type = new Map([['variables', [WebAssemblyType.INT_32]]]);
            const content = 'function variables(a) { var x, y; x = 10; y = 20; return x * y; }';
            const wrapper = transpiler.transpile(content, type);

            expect(wrapper.setFunctionName('variables').call(100)).to.equal(200);
        });

        it('should handle multiple variables with direct assignments', () => {
            const type = new Map([['variables', [WebAssemblyType.INT_32]]]);
            const content = 'function variables(a) { var x = 10, y = 20; return x * y; }';
            const wrapper = transpiler.transpile(content, type);

            expect(wrapper.setFunctionName('variables').call(100)).to.equal(200);
        });

        it('should handle variables within branches', () => {
            const type = new Map([['variables', [WebAssemblyType.INT_32]]]);
            const content = 'function variables(a) { var x; if (a) { x = 10; } else { x = 20; } return x; }';
            const wrapper = transpiler.transpile(content, type);

            wrapper.setFunctionName('variables');

            expect(wrapper.call(true)).to.equal(10);
            expect(wrapper.call(false)).to.equal(20);
        });

        it('should hoist variable declarations', () => {
            const type = new Map([['variables', [WebAssemblyType.INT_32]]]);
            const content = 'function variables(a) { x = 20; if (a) { var x; } return x; }';
            const wrapper = transpiler.transpile(content, type);

            wrapper.setFunctionName('variables');

            expect(wrapper.call(true)).to.equal(20);
            expect(wrapper.call(false)).to.equal(20);
        });

        it('should handle duplicate variable declaration', () => {
            const type = new Map([['variables', [WebAssemblyType.INT_32]]]);
            const content = 'function variables() { var x = 20; var x = 10; return x; }';
            const wrapper = transpiler.transpile(content, type);

            expect(wrapper.setFunctionName('variables').call()).to.equal(10);

            const type2 = new Map([['variables', [WebAssemblyType.INT_32]]]);
            const content2 = 'function variables() { var x = 20; var x; return x; }';
            const wrapper2 = transpiler.transpile(content2, type2);

            expect(wrapper2.setFunctionName('variables').call()).to.equal(20);
        });
    });
});
