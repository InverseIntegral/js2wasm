import {expect} from 'chai';
import {WebAssemblyType} from '../../src/generator/wasm_type';
import Transpiler from '../../src/transpiler';

describe('Transpiler', () => {

    let transpiler: Transpiler;

    beforeEach(() => {
        transpiler = new Transpiler();
    });

    describe('#transpile()', () => {

        it('should handle if else statements', () => {
            const content = 'function alwaysOne() { if (false) { return 100; } else { return 1; } }';

            const wrapper = transpiler
                .setSignature('alwaysOne', WebAssemblyType.INT_32)
                .transpile(content);
            expect(wrapper.setFunctionName('alwaysOne').call()).to.equal(1);
        });

        it('should handle if statements without else part', () => {
            const content = 'function alwaysOne() { if (false) { return 100; } return 1; }';

            const wrapper = transpiler
                .setSignature('alwaysOne', WebAssemblyType.INT_32)
                .transpile(content);
            expect(wrapper.setFunctionName('alwaysOne').call()).to.equal(1);

            const content2 = 'function alwaysTwo() { if (true) { return 2; } return 1; }';

            const wrapper2 = transpiler
                .setSignature('alwaysTwo', WebAssemblyType.INT_32)
                .transpile(content2);
            expect(wrapper2.setFunctionName('alwaysTwo').call()).to.equal(2);
        });

        it('should handle else if statements', () => {
            const content = 'function elseIf(a, b) { if (a) { return 0; } else if (b) { return 1; } return 2; }';

            const wrapper = transpiler
                .setSignature('elseIf', WebAssemblyType.INT_32, WebAssemblyType.BOOLEAN, WebAssemblyType.BOOLEAN)
                .transpile(content);
            wrapper.setFunctionName('elseIf');

            expect(wrapper.call(true, false)).to.equal(0);
            expect(wrapper.call(true, true)).to.equal(0);
            expect(wrapper.call(false, true)).to.equal(1);
            expect(wrapper.call(false, false)).to.equal(2);
        });

        it('should handle multiple else if statements', () => {
            const content = 'function elseIf(a, b, c) { ' +
                'if (a) { return 0; } ' +
                'else if (b) { return 1; } ' +
                'else if (c) { return 2; } ' +
                'else { return 3; } }';

            const wrapper = transpiler
                .setSignature('elseIf', WebAssemblyType.INT_32, WebAssemblyType.BOOLEAN,
                    WebAssemblyType.BOOLEAN, WebAssemblyType.BOOLEAN)
                .transpile(content);
            wrapper.setFunctionName('elseIf');

            expect(wrapper.call(true, true, true)).to.equal(0);
            expect(wrapper.call(true, true, false)).to.equal(0);
            expect(wrapper.call(true, false, true)).to.equal(0);
            expect(wrapper.call(true, false, false)).to.equal(0);
            expect(wrapper.call(false, true, true)).to.equal(1);
            expect(wrapper.call(false, true, false)).to.equal(1);
            expect(wrapper.call(false, false, true)).to.equal(2);
            expect(wrapper.call(false, false, false)).to.equal(3);
        });

        it('should handle logical operators in if statement', () => {
            const content = 'function elseIf(a, b) {' +
                'if (a && b) { return 0; }' +
                'else if (a || b) { return 1; }' +
                'else { return 2; } }';

            const wrapper = transpiler
                .setSignature('elseIf', WebAssemblyType.INT_32, WebAssemblyType.BOOLEAN, WebAssemblyType.BOOLEAN)
                .transpile(content);
            wrapper.setFunctionName('elseIf');

            expect(wrapper.call(true, true)).to.equal(0);
            expect(wrapper.call(true, false)).to.equal(1);
            expect(wrapper.call(false, true)).to.equal(1);
            expect(wrapper.call(false, false)).to.equal(2);
        });
        it('should handle if with multiple statements', () => {
            const content = 'function elseIf(a, b, value) { ' +
                'if (a) { value += 1; return value; } ' +
                'else if (b) { value += 2; return value; } ' +
                'else { value += 3; return value; } }';

            const wrapper = transpiler
                .setSignature('elseIf', WebAssemblyType.INT_32, WebAssemblyType.BOOLEAN,
                    WebAssemblyType.BOOLEAN, WebAssemblyType.INT_32)
                .transpile(content);
            wrapper.setFunctionName('elseIf');

            expect(wrapper.call(true, false, 1)).to.equal(2);
            expect(wrapper.call(false, true, 1)).to.equal(3);
            expect(wrapper.call(false, false, 1)).to.equal(4);
        });

        it('should handle if statements without braces', () => {
            const content = 'function ifWithout(a) { if (a) return 10; else return 20; }';

            const wrapper = transpiler
                .setSignature('ifWithout', WebAssemblyType.INT_32, WebAssemblyType.BOOLEAN)
                .transpile(content);
            wrapper.setFunctionName('ifWithout');

            expect(wrapper.call(true)).to.equal(10);
            expect(wrapper.call(false)).to.equal(20);
        });

        it('should handle else if statements without braces', () => {
            const content = 'function ifWithout(a, b) { if (a) return 10; else if(b) return 20; else return 30; }';

            const wrapper = transpiler
                .setSignature('ifWithout', WebAssemblyType.INT_32, WebAssemblyType.BOOLEAN, WebAssemblyType.BOOLEAN)
                .transpile(content);
            wrapper.setFunctionName('ifWithout');

            expect(wrapper.call(true, false)).to.equal(10);
            expect(wrapper.call(false, true)).to.equal(20);
            expect(wrapper.call(false, false)).to.equal(30);
        });
    });
});
