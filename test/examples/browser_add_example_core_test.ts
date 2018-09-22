import { expect } from 'chai';
import add from '../../src/examples/browser_add_example_core';

describe('Direct binary code add example', () => {
    it('Add two positive numbers', () => {
        expect(add(21, 21)).to.equal(42);
    });
    it('Add one negative and one positive number', () => {
        expect(add(-18, 21)).to.equal(3);
    });
    it('Add two negative numbers', () => {
        expect(add(-13, -2)).to.equal(-15);
    });
});
