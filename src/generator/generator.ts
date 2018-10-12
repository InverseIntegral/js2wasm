import {FunctionExpression} from '@babel/types';
import {i32, Module} from 'binaryen';
import {DeclarationVisitor, Mapping} from './declaration_visitor';
import GeneratorVisitor from './generator_visitor';

class Generator {

    public static generate(tree: FunctionExpression): Module {
        if (tree.id === null) {
            throw new Error('Function expression has to have a name in order to be translated');
        }

        const functionName = tree.id.name;
        const parameters = new Array(tree.params.length).fill(i32);
        const module = new Module();

        const functionType = module.addFunctionType(functionName, i32, parameters);

        const [parameterMapping, variableMapping] = new DeclarationVisitor().run(tree);
        const totalMapping = Generator.mergeMappings(parameterMapping, variableMapping);
        const variables = new Array(variableMapping.size).fill(i32);

        const generatorVisitor = new GeneratorVisitor(module, totalMapping);
        const body = generatorVisitor.run(tree);

        module.addFunction(functionName, functionType, variables, body);
        module.addFunctionExport(functionName, functionName);

        return module;
    }

    private static mergeMappings(first: Mapping,
                                 second: Mapping): Mapping {
        return new Map([...first, ...second]);
    }

}

export default Generator;
