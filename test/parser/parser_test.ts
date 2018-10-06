import {expect} from 'chai';
import Parser from '../../src/parser/parser';

describe('Parser', () => {
    describe('#parse()', () => {
        it('should work on an empty function', () => {
            expect(() => Parser.parse('function() {}')).to.not.throw();
        });
        it('should not work on non-functions', () => {
            expect(() => Parser.parse('1 + 2;')).to.throw();
        });
    });
});
