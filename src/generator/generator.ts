import {FunctionExpression, isIdentifier, LVal,} from '@babel/types';
import {i32, Module} from 'binaryen';
import GeneratorVisitor from './generator_visitor';

class Generator {

    public static generate(tree: FunctionExpression): Module {
        if (tree.id === null) {
            throw new Error('Function expression has to have a name in order to be translated');
        }

        const functionName = tree.id.name;
        const parameters = new Array(tree.params.length).fill(i32);
        const module = new Module();

        // Currently the function has to return an integer
        const functionType = module.addFunctionType(functionName, i32, parameters);
        const generatorVisitor = new GeneratorVisitor(module, Generator.getParameterMappings((tree.params)));

        const body = generatorVisitor.run(tree);

        module.addFunction(functionName, functionType, [], body);
        module.addFunctionExport(functionName, functionName);

        return module;
    }

    private static getParameterMappings(params: LVal[]) {
        const mapping = new Map();

        params.forEach((node, index) => {
            if (isIdentifier(node)) {
                mapping.set(node.name, index);
            }
        });

        return mapping;
    }

}

export default Generator;
