"use strict";
exports.__esModule = true;
var chai_1 = require("chai");
var example_1 = require("../src/example");
describe('Example function', function () {
    it('should return 42', function () {
        chai_1.expect(example_1["default"](21, 21)).to.equal(42);
    });
});
