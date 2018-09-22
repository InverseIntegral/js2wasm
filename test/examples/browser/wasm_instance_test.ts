import { expect } from 'chai';
import WasmInstance from '../../../src/examples/browser/WasmInstance';

let instance: WasmInstance;

beforeEach('Setting up the WasmInstance', () => {
    instance = new WasmInstance();
});

describe('Direct binary code add example', () => {
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
