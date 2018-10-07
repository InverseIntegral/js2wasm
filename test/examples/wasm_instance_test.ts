import { expect } from 'chai';
import Core from '../../src/example/core';
import WasmInstance from '../../src/example/wasm_instance';

let instance: WasmInstance;

beforeEach('Setting up the WasmInstance', () => {
    const core = new Core();
    instance = new WasmInstance(core.binaryArray);
});

describe('Binaryen created add example', () => {
    it('Add two positive numbers', () => {
        expect(instance.add(21, 21)).to.equal(42);
    });
    it('Add one negative and one positive number', () => {
        expect(instance.add(-18, 21)).to.equal(3);
    });
    it('Add two negative numbers', () => {
        expect(instance.add(-13, -2)).to.equal(-15);
    });
});
