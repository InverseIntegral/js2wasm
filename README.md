# JS2Wasm
[![Build Status](https://travis-ci.org/InverseIntegral/js2wasm.svg?branch=develop)](https://travis-ci.org/InverseIntegral/js2wasm)

JS2Wasm compiles a subset of JavaScript to WebAssembly and runs directly in the browser. It focuses on performance and portability.

# Installation
Currently a direct installation using npm or yarn is not possible. If you want to try the current version you have to
clone the repository.

# Usage
In order to compile a function you have to supply its code as a string and its function signatures as a map to the `transpile` function.
The returned value is of the type `CallWrapper`.

```javascript
const signature = new Map();
signature.set('add', [WebAssemblyType.INT_32, WebAssemblyType.INT_32]);

const wrapper = new Transpiler().transpile('function add(a, b) { return a + b; }', signature);
wrapper.setFunctionName('add').call(21, 21);
```

# API
## Transpiler
* new Transpiler(): `void` <br />
  Creates a new transpiler with an empty hook class.
* new Transpiler(hooks: `TranspilerHooks`): `void` <br />
  Creates a new transpiler with the specified hook instance.
* Transpiler#**setSignature**(name: `string`, returnType: `WebAssemblyType`, ...parameterTypes: `WebassemblyType[]`): `Transpiler` <br />
  Creates a mapping from the function name to the return type and the parameter types.
  The parameter types must be in the same order as they appear in the content string.
* Transpiler#**transpile**(content: `string`): `CallWrapper` <br />
  Transpiles the specified content and checks the validity of the function signatures.
  The content can contain multiple functions.

## WebAssemblyType
* **INT_32** <br />
  The WebAssembly int32 type.
* **INT_32_ARRAY** <br />
  An array of `INT_32` elements.
* **BOOLEAN** <br />
  The boolean type.

## CallWrapper
* CallWrapper#**setFunctionName**(functionName: `string`): `CallWrapper` <br />
  Set the name of the initial function to be called.
* CallWrapper#**setOutParameters**(...outParameters: `any[]`): `CallWrapper` <br />
  Set the memory dependent parameters, of which the modified values need to be written back to JavaScript. 
* CallWrapper#**call**(...parameters: `any[]`): `any` <br />
  Calls the initial function of the transpiled Wasm code.

## TranspilerHooks
TranspilerHooks is an interface. The following methods are hook methods, which get called by the `Transpiler` and the `CallWrapper`. The `NullTranspilerHooks` is the default implementation, in which all methods are empty.

* TranspilerHooks#**beforeCompilation**(): `void` <br />
  Called before the transpilation process.
* TranspilerHooks#**afterCompilation**(): `void` <br />
  Called after the transpilation process has finished.
* TranspilerHooks#**beforeImport**(): `void` <br />
  Called before the memory import process.
* TranspilerHooks#**afterImport**(): `void` <br />
  Called after the memroy import process has finished.
* TranspilerHooks#**beforeExecution**(): `void` <br />
  Called before the Wasm code gets executed.
* TranspilerHooks#**afterExecution**(): `void` <br />
  Called after the Wasm execution has finished.
* TranspilerHooks#**beforeExport**(): `void` <br />
  Called before the memory export process.
* TranspilerHooks#**afterExport**(): `void` <br />
  Called after the memory export process has finished.
