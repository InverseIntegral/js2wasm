import {
    FunctionExpression,
    isBinaryExpression, isBlockStatement,
    isIdentifier, isNumericLiteral,
    isReturnStatement,
    LVal,
    Node,
    TraversalAncestors,
    traverse,
} from '@babel/types';
import {Expression, i32, Module, Statement} from 'binaryen';

class Generator {

    private readonly module: Module;

    private body: Statement;
    private parameterMapping: Map<string, number>;

    constructor() {
        this.module = new Module();
        this.parameterMapping = new Map<string, number>();
    }

    public generate(tree: FunctionExpression): Module {
        if (tree.id === null) {
            throw new Error('Function expression has to have a name in order to be translated');
        }

        const functionName = tree.id.name;
        const params = new Array(tree.params.length).fill(i32);

        this.setParameterMappings(tree.params);

        // Currently the function has to return an integer
        const functionType = this.module.addFunctionType(functionName, i32, params);

        traverse(tree.body, {
            exit: this.visit.bind(this),
        }, []);

        this.module.addFunction(functionName, functionType, [], this.body);
        this.module.addFunctionExport(functionName, functionName);

        return this.module;
    }

    private setParameterMappings(params: LVal[]) {
        params.forEach((node, index) => {
            if (isIdentifier(node)) {
                this.parameterMapping.set(node.name, index);
            }
        }, this);
    }

    private visit(node: Node, parent: TraversalAncestors, expressions: Expression[]) {
        if (isNumericLiteral(node)) {
            expressions.push(this.module.i32.const(node.value));
        } else if (isIdentifier(node)) {
            const name = node.name;
            const index = this.parameterMapping.get(name);

            if (index === undefined) {
                throw new Error(`Unknown identifier ${name}`);
            }

            expressions.push(this.module.getLocal(index, i32));
        } else if (isReturnStatement(node)) {
            this.body = this.module.return(expressions.pop());
        } else if (isBinaryExpression(node)) {
            const right = expressions.pop();
            const left = expressions.pop();

            if (left === undefined || right === undefined) {
                throw new Error('Malformed AST');
            }

            if (node.operator === '+') {
                expressions.push(this.module.i32.add(left, right));
            } else if (node.operator === '-') {
                expressions.push(this.module.i32.sub(left, right));
            } else {
                throw new Error(`Unhandled operator ${node.operator}`);
            }
        } else if (isBlockStatement(node)) {
            // Empty because otherwise an error gets thrown
        } else {
            throw new Error(`Unknown node of type ${node.type} visited`);
        }
    }

}

export default Generator;
