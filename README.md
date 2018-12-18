# JS2Wasm
[![Build Status](https://travis-ci.org/InverseIntegral/js2wasm.svg?branch=develop)](https://travis-ci.org/InverseIntegral/js2wasm)

JS2Wasm compiles a subset of JavaScript to WebAssembly and runs directly in the browser. It focuses on performance and portability.

# Installation
Currently a direct installation using npm or yarn is not possible. If you want to try the current version you have to
clone the repository.

# Usage
Run `npm run build` to compile and bundle the code.
In order to compile a function you have to supply its code as a string and its function signatures as a map to the `transpile` function.
The returned value is of the type `CallWrapper`.

```javascript
const { Transpiler, WebAssemblyType } = js2wasm;
const wrapper = new Transpiler()
    .setSignature('add', WebAssemblyType.INT_32, WebAssemblyType.INT_32, WebAssemblyType.INT_32)
    .transpile('function add(a, b) { return a + b; }');
    
wrapper.setFunctionName('add').call(21, 21);
```

# Benchmarks
To run the benchmarks you have to build them using  `npm run build` then open the `dist/benchmark/index.html` in a browser.

The results are printed to the console in the following format:
```
jsMean, wasmMean, jsVariance, wasmVariance wasmCompilationMean, wasmImportMean, wasmExecutionMean, wasmExportMean
```

# API
## Transpiler
* new Transpiler(): `void` <br />
  Creates a new transpiler with an empty hook class.
* new Transpiler(hooks: `TranspilerHooks`): `void` <br />
  Creates a new transpiler with the specified hook instance.
* Transpiler#**setSignature**(name: `string`, returnType: `WebAssemblyType`, ...parameterTypes: `WebAssemblyType[]`): `Transpiler` <br />
  Creates a mapping from the function name to the return type and the parameter types.
  The parameter types must be in the same order as they appear in the content string.
* Transpiler#**transpile**(content: `string`): `CallWrapper` <br />
  Transpiles the specified content and checks the validity of the function signatures.
  The content can contain multiple functions.

## WebAssemblyType
* **INT_32** <br />
  The WebAssembly int32 type.
* **FLOAT_64** <br />
  The WebAssembly float64 type.
* **FLOAT_64_ARRAY** <br />
  An array of `FLOAT_64` elements.
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
