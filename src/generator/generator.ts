import {File, FunctionDeclaration, isFunctionDeclaration} from '@babel/types';
import {i32, Module} from 'binaryen';
import {DeclarationVisitor, Mapping} from './declaration_visitor';
import Function from './function';
import GeneratorVisitor from './generator_visitor';
import {toBinaryenType} from './wasm_type';

// noinspection TsLint
type Functions = Map<string, Function>;

class Generator {

    public static generate(file: File, functions: Functions): Module {
        const module = new Module();

        file.program.body.forEach((statement) => {
            if (!isFunctionDeclaration(statement)) {
                throw new Error('File can only contain function declarations');
            }

            this.generateFunction(module, statement, functions);
        });

        return module;
    }

    public static generateFunction(module: Module, tree: FunctionDeclaration, functions: Functions) {
        if (tree.id === null) {
            throw new Error('Function expression has to have a name in order to be translated');
        }

        const functionName = tree.id.name;
        const functionSignature = functions.get(functionName);

        if (functionSignature === undefined) {
            throw new Error(`No type for function ${functionName} defined`);
        }

        const parameterTypes = functionSignature.parameterTypes.map(toBinaryenType);
        const returnType = toBinaryenType(functionSignature.returnType);

        const [parameterMapping, variableMapping] = new DeclarationVisitor().run(tree);

        const totalMapping = Generator.mergeMappings(parameterMapping, variableMapping);
        const variables = new Array(variableMapping.size).fill(i32);

        const generatorVisitor = new GeneratorVisitor(module, totalMapping);
        const body = generatorVisitor.run(tree);

        const functionType = module.addFunctionType(functionName, returnType, parameterTypes);
        module.addFunction(functionName, functionType, variables, body);
        module.addFunctionExport(functionName, functionName);
    }

    private static mergeMappings(first: Mapping,
                                 second: Mapping): Mapping {
        return new Map([...first, ...second]);
    }

}

export {Generator, Functions};
