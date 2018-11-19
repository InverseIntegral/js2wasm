import {expect} from 'chai';
import {WebAssemblyType} from '../../src/generator/wasm_type';
import Transpiler from '../../src/transpiler';

describe('Transpiler', () => {

    let transpiler: Transpiler;

    beforeEach(() => {
        transpiler = new Transpiler();
    });

    describe('#transpile()', () => {
        it('should handle simple for', () => {
            const content = 'function loop(value, times) {' +
                'for (var i = 0; i < times; i++) { value += 1; }' +
                'return value; }';
            const wrapper = transpiler
                .setSignature('loop', WebAssemblyType.INT_32, WebAssemblyType.INT_32, WebAssemblyType.INT_32)
                .transpile(content);
            wrapper.setFunctionName('loop');

            expect(wrapper.call(10, 5)).to.equal(15);
            expect(wrapper.call(-10, 5)).to.equal(-5);
            expect(wrapper.call(10, 0)).to.equal(10);
            expect(wrapper.call(10, -1)).to.equal(10);
        });

        it('should handle nested for', () => {
            const content = 'function loop(value, times) { ' +
                'for (var i = 0; i < times; i++) { ' +
                'for (var x = 0; x < times; x++) { value += 1; } }' +
                'return value; }';
            const wrapper = transpiler
                .setSignature('loop', WebAssemblyType.INT_32, WebAssemblyType.INT_32, WebAssemblyType.INT_32)
                .transpile(content);
            wrapper.setFunctionName('loop');

            expect(wrapper.call(10, 5)).to.equal(35);
            expect(wrapper.call(-10, 5)).to.equal(15);
            expect(wrapper.call(10, 0)).to.equal(10);
            expect(wrapper.call(10, -1)).to.equal(10);
        });

        it('should handle multiple for', () => {
            const content = 'function loop(value, times) { ' +
                'for (var i = 0; i < times; i++) { value += 1; }' +
                'for (var i = 0; i < times; i++) { value += 1; }' +
                'return value; }';
            const wrapper = transpiler
                .setSignature('loop', WebAssemblyType.INT_32, WebAssemblyType.INT_32, WebAssemblyType.INT_32)
                .transpile(content);
            wrapper.setFunctionName('loop');

            expect(wrapper.call(10, 5)).to.equal(20);
            expect(wrapper.call(-10, 5)).to.equal(0);
            expect(wrapper.call(10, 0)).to.equal(10);
            expect(wrapper.call(10, -1)).to.equal(10);
        });

        it('should handle for in if', () => {
            const content = 'function loop(value, times) { ' +
                'if (value >= 0) { for (var i = 0; i < times; i++) { value += 1; } }' +
                'return value; }';
            const wrapper = transpiler
                .setSignature('loop', WebAssemblyType.INT_32, WebAssemblyType.INT_32, WebAssemblyType.INT_32)
                .transpile(content);
            wrapper.setFunctionName('loop');

            expect(wrapper.call(10, 5)).to.equal(15);
            expect(wrapper.call(-10, 5)).to.equal(-10);
            expect(wrapper.call(10, 0)).to.equal(10);
            expect(wrapper.call(10, -1)).to.equal(10);
        });

        it('should handle if in while', () => {
            const content = 'function loop(value, times) { ' +
                'for (var i = 0; i < times; i++) { if (value >= 0) { value += 1; } }' +
                'return value; }';
            const wrapper = transpiler
                .setSignature('loop', WebAssemblyType.INT_32, WebAssemblyType.INT_32, WebAssemblyType.INT_32)
                .transpile(content);
            wrapper.setFunctionName('loop');

            expect(wrapper.call(10, 5)).to.equal(15);
            expect(wrapper.call(-10, 5)).to.equal(-10);
            expect(wrapper.call(10, 0)).to.equal(10);
            expect(wrapper.call(10, -1)).to.equal(10);
        });

        it('should handle else-if in for', () => {
            const content = 'function loop(value, times) { ' +
                'for (var i = 0; i < times; i++) { ' +
                'if (value >= 0) { value += 1; }' +
                'else if (value >= -10) { value += 2; }' +
                'else { value += 4; } }' +
                'return value; }';
            const wrapper = transpiler
                .setSignature('loop', WebAssemblyType.INT_32, WebAssemblyType.INT_32, WebAssemblyType.INT_32)
                .transpile(content);
            wrapper.setFunctionName('loop');

            expect(wrapper.call(10, 5)).to.equal(15);
            expect(wrapper.call(-10, 5)).to.equal(0);
            expect(wrapper.call(-20, 5)).to.equal(-4);
            expect(wrapper.call(10, 0)).to.equal(10);
            expect(wrapper.call(10, -1)).to.equal(10);
        });

        it('should handle for loop without braces', () => {
            const content = 'function loop(times) { ' +
                'var loopCount = 0;' +
                'for (var i = 0; i < times; i++) loopCount++; ' +
                'return loopCount; }';
            const wrapper = transpiler
                .setSignature('loop', WebAssemblyType.INT_32, WebAssemblyType.INT_32)
                .transpile(content);
            wrapper.setFunctionName('loop');

            expect(wrapper.call(5)).to.equal(5);
            expect(wrapper.call(0)).to.equal(0);
            expect(wrapper.call(-1)).to.equal(0);
        });

        it('should handle for loop without initialization', () => {
            const content = 'function loop(value, times) { ' +
                'var i = 0;' +
                'for (; i < times; i++) { value += 1; }' +
                'return value; }';
            const wrapper = transpiler
                .setSignature('loop', WebAssemblyType.INT_32, WebAssemblyType.INT_32, WebAssemblyType.INT_32)
                .transpile(content);
            wrapper.setFunctionName('loop');

            expect(wrapper.call(10, 5)).to.equal(15);
            expect(wrapper.call(-10, 5)).to.equal(-5);
            expect(wrapper.call(10, 0)).to.equal(10);
            expect(wrapper.call(10, -1)).to.equal(10);
        });

        it('should handle for loop without update', () => {
            const content = 'function loop(value, times) { ' +
                'for (var i = 0; i < times;) { value += 1; i++; }' +
                'return value; }';
            const wrapper = transpiler
                .setSignature('loop', WebAssemblyType.INT_32, WebAssemblyType.INT_32, WebAssemblyType.INT_32)
                .transpile(content);
            wrapper.setFunctionName('loop');

            expect(wrapper.call(10, 5)).to.equal(15);
            expect(wrapper.call(-10, 5)).to.equal(-5);
            expect(wrapper.call(10, 0)).to.equal(10);
            expect(wrapper.call(10, -1)).to.equal(10);
        });

        it('should handle for loop without condition', () => {
            const content = 'function loop(times) { ' +
                'for (var i = 0;; i++) { return 0; }' +
                'return -1; }';
            const wrapper = transpiler
                .setSignature('loop', WebAssemblyType.INT_32, WebAssemblyType.INT_32)
                .transpile(content);
            wrapper.setFunctionName('loop');

            expect(wrapper.call(5)).to.equal(0);
            expect(wrapper.call(0)).to.equal(0);
            expect(wrapper.call(-1)).to.equal(0);
        });

        it('should handle for loop with assignment as init', () => {
            const content = 'function loop(value, times) { ' +
                'var i;' +
                'for (i = 0; i < times; i++) { value += 1; }' +
                'return value; }';
            const wrapper = transpiler
                .setSignature('loop', WebAssemblyType.INT_32, WebAssemblyType.INT_32, WebAssemblyType.INT_32)
                .transpile(content);
            wrapper.setFunctionName('loop');

            expect(wrapper.call(10, 5)).to.equal(15);
            expect(wrapper.call(-10, 5)).to.equal(-5);
            expect(wrapper.call(10, 0)).to.equal(10);
            expect(wrapper.call(10, -1)).to.equal(10);
        });

        it('should handle for loop with shorthand assignment as update', () => {
            const content = 'function loop(value, times) { ' +
                'for (var i = 0; i < times; i += 1) { value += 1; }' +
                'return value; }';
            const wrapper = transpiler
                .setSignature('loop', WebAssemblyType.INT_32, WebAssemblyType.INT_32, WebAssemblyType.INT_32)
                .transpile(content);
            wrapper.setFunctionName('loop');

            expect(wrapper.call(10, 5)).to.equal(15);
            expect(wrapper.call(-10, 5)).to.equal(-5);
            expect(wrapper.call(10, 0)).to.equal(10);
            expect(wrapper.call(10, -1)).to.equal(10);
        });

        it('should handle for loop with assignment as update', () => {
            const content = 'function loop(value, times) { ' +
                'for (var i = 0; i < times; i = i + 1) { value += 1; }' +
                'return value; }';
            const wrapper = transpiler
                .setSignature('loop', WebAssemblyType.INT_32, WebAssemblyType.INT_32, WebAssemblyType.INT_32)
                .transpile(content);
            wrapper.setFunctionName('loop');

            expect(wrapper.call(10, 5)).to.equal(15);
            expect(wrapper.call(-10, 5)).to.equal(-5);
            expect(wrapper.call(10, 0)).to.equal(10);
            expect(wrapper.call(10, -1)).to.equal(10);
        });
    });
});
