# JS2Wasm
[![Build Status](https://travis-ci.org/InverseIntegral/js2wasm.svg?branch=develop)](https://travis-ci.org/InverseIntegral/js2wasm)

JS2Wasm compiles a subset of JavaScript to WebAssembly and runs directly in the browser. It focuses on performance and portability.

# Installation
Currently a direct installation using npm or yarn is not possible. If you want to try the current version you have to
clone the repository.

# Usage
In order to compile a function you have to supply it as a string to the `transpile` function.
The returned function takes the name of the function that you want to call as the first parameter.
Any further parameters get passed to the WebAssembly instance.

```javascript
const exports = Transpiler.transpile('function add(a, b) { return a + b; }');
const result = exports('add', 12, 30);
```
