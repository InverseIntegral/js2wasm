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
            const content = 'function plusAssign(a) { var b = 1; b += a; return b; }';
            const wrapper = transpiler
                .setSignature('plusAssign', WebAssemblyType.INT_32, WebAssemblyType.INT_32)
                .transpile(content);
            wrapper.setFunctionName('plusAssign');

            expect(wrapper.call(5)).to.equal(6);
            expect(wrapper.call(-5)).to.equal(-4);
        });

        it('should handle minus shorthand assignment', () => {
            const content = 'function minusAssign(a) { var b = 1; b -= a; return b; }';
            const wrapper = transpiler
                .setSignature('minusAssign', WebAssemblyType.INT_32, WebAssemblyType.INT_32)
                .transpile(content);
            wrapper.setFunctionName('minusAssign');

            expect(wrapper.call(5)).to.equal(-4);
            expect(wrapper.call(-5)).to.equal(6);
        });

        it('should handle multiplication shorthand assignment', () => {
            const content = 'function multAssign(a) { var b = 2; b *= a; return b; }';
            const wrapper = transpiler
                .setSignature('multAssign', WebAssemblyType.INT_32, WebAssemblyType.INT_32)
                .transpile(content);
            wrapper.setFunctionName('multAssign');

            expect(wrapper.call(5)).to.equal(10);
            expect(wrapper.call(-5)).to.equal(-10);
        });

        it('should handle division shorthand assignment', () => {
            const content = 'function divAssign(a) { var b = 10; b /= a; return b; }';
            const wrapper = transpiler
                .setSignature('divAssign', WebAssemblyType.INT_32, WebAssemblyType.INT_32)
                .transpile(content);
            wrapper.setFunctionName('divAssign');

            expect(wrapper.call(5)).to.equal(2);
            expect(wrapper.call(-5)).to.equal(-2);
        });

        it('should handle a single variable', () => {
            const content = 'function variables(a) { var x; x = 10; return x; }';
            const wrapper = transpiler
                .setSignature('variables', WebAssemblyType.INT_32, WebAssemblyType.INT_32)
                .transpile(content);

            expect(wrapper.setFunctionName('variables').call(100)).to.equal(10);
        });

        it('should handle a single variable with direct assignment', () => {
            const wrapper = transpiler
                .setSignature('variables', WebAssemblyType.INT_32)
                .transpile('function variables() { var x = 10; return x; }');

            expect(wrapper.setFunctionName('variables').call()).to.equal(10);
        });

        it('should handle multiple variables', () => {
            const content = 'function variables(a) { var x, y; x = 10; y = 20; return x * y; }';
            const wrapper = transpiler
                .setSignature('variables', WebAssemblyType.INT_32, WebAssemblyType.INT_32)
                .transpile(content);

            expect(wrapper.setFunctionName('variables').call(100)).to.equal(200);
        });

        it('should handle multiple variables with direct assignments', () => {
            const content = 'function variables(a) { var x = 10, y = 20; return x * y; }';
            const wrapper = transpiler
                .setSignature('variables', WebAssemblyType.INT_32, WebAssemblyType.INT_32)
                .transpile(content);

            expect(wrapper.setFunctionName('variables').call(100)).to.equal(200);
        });

        it('should handle variables within branches', () => {
            const content = 'function variables(a) { var x; if (a) { x = 10; } else { x = 20; } return x; }';
            const wrapper = transpiler
                .setSignature('variables', WebAssemblyType.INT_32, WebAssemblyType.BOOLEAN)
                .transpile(content);

            wrapper.setFunctionName('variables');

            expect(wrapper.call(true)).to.equal(10);
            expect(wrapper.call(false)).to.equal(20);
        });

        it('should hoist variable declarations', () => {
            const content = 'function variables(a) { x = 20; if (a) { var x; } return x; }';
            const wrapper = transpiler
                .setSignature('variables', WebAssemblyType.INT_32, WebAssemblyType.BOOLEAN)
                .transpile(content);

            wrapper.setFunctionName('variables');

            expect(wrapper.call(true)).to.equal(20);
            expect(wrapper.call(false)).to.equal(20);
        });

        it('should handle duplicate variable declaration', () => {
            const content = 'function variables() { var x = 20; var x = 10; return x; }';
            const wrapper = transpiler
                .setSignature('variables', WebAssemblyType.INT_32).transpile(content);

            expect(wrapper.setFunctionName('variables').call()).to.equal(10);

            const content2 = 'function variables() { var x = 20; var x; return x; }';
            const wrapper2 = transpiler
                .setSignature('variables', WebAssemblyType.INT_32)
                .transpile(content2);

            expect(wrapper2.setFunctionName('variables').call()).to.equal(20);
        });
    });
});
