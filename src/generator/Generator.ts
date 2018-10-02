import {
    FunctionExpression,
    isBinaryExpression,
    isBlockStatement,
    isIdentifier,
    isNumericLiteral,
    isReturnStatement,
    LVal,
    Node,
    TraversalAncestors,
    traverse,
} from '@babel/types';
import {i32, Module} from 'binaryen';
import VisitorState from './VisitorState';

class Generator {

    private readonly module: Module;

    private parameterMapping: Map<string, number>;
    private readonly state: VisitorState;

    constructor() {
        this.module = new Module();
        this.parameterMapping = new Map<string, number>();
        this.state = new VisitorState();
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
        }, this.state);

        this.module.addFunction(functionName, functionType, [], this.state.body);
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

    private visit(node: Node, _: TraversalAncestors, state: VisitorState) {
        if (isNumericLiteral(node)) {
            this.visitNumericLiteral(node.value, state);
        } else if (isIdentifier(node)) {
            this.visitIdentifier(node.name, state);
        } else if (isReturnStatement(node)) {
            this.visitReturn(state);
        } else if (isBinaryExpression(node)) {
            this.visitBinaryExpression(node.operator, state);
        } else if (isBlockStatement(node)) {
            this.visitBlockStatement(state);
        } else {
            throw new Error(`Unknown node of type ${node.type} visited`);
        }
    }

    private visitNumericLiteral(value: number, state: VisitorState) {
        state.expressions.push(this.module.i32.const(value));
    }

    private visitIdentifier(name: string, state: VisitorState) {
        const index = this.parameterMapping.get(name);

        if (index === undefined) {
            throw new Error(`Unknown identifier ${name}`);
        }

        state.expressions.push(this.module.getLocal(index, i32));
    }

    private visitReturn(state: VisitorState) {
        state.statements.push(this.module.return(state.expressions.pop()));
    }

    private visitBinaryExpression(operator: string, state: VisitorState) {
        const right = state.expressions.pop();
        const left = state.expressions.pop();

        if (left === undefined || right === undefined) {
            throw new Error('Malformed AST');
        }

        switch (operator) {
            case '+':
                state.expressions.push(this.module.i32.add(left, right));
                break;
            case '-':
                state.expressions.push(this.module.i32.sub(left, right));
                break;
            default:
                throw new Error(`Unhandled operator ${operator}`);
        }
    }

    private visitBlockStatement(state: VisitorState) {
        state.body = this.module.block('', state.statements);
    }

}

export default Generator;
