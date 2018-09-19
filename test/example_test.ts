import { expect } from 'chai';
import adder from '../src/example';

describe('Example function', () => {
   it('should return 42', () => {
     expect(adder(21, 21)).to.equal(42);
   });
});