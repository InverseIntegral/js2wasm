import {
    FunctionExpression,
    IfStatement,
    isBinaryExpression,
    isBlockStatement,
    isBooleanLiteral,
    isIdentifier,
    isIfStatement,
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

    private static getImmediateParent(parent: TraversalAncestors): Node | undefined {
        const last = parent[parent.length - 1];

        if (last !== undefined) {
            return last.node;
        } else {
            return undefined;
        }
    }

    private readonly module: Module;
    private parameterMapping: Map<string, number>;

    constructor() {
        this.module = new Module();
        this.parameterMapping = new Map();
    }

    public generate(tree: FunctionExpression): Module {
        if (tree.id === null) {
            throw new Error('Function expression has to have a name in order to be translated');
        }

        const functionName = tree.id.name;
        const parameters = new Array(tree.params.length).fill(i32);

        this.setParameterMappings(tree.params);

        // Currently the function has to return an integer
        const functionType = this.module.addFunctionType(functionName, i32, parameters);

        const visitorState = new VisitorState();

        traverse(tree.body, {
            exit: this.visit.bind(this),
        }, visitorState);

        this.module.addFunction(functionName, functionType, [], visitorState.body);
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

    private visit(node: Node, parent: TraversalAncestors, state: VisitorState) {
        if (isNumericLiteral(node)) {
            this.visitNumericLiteral(node.value, state);
        } else if (isBooleanLiteral(node)) {
            this.visitBooleanLiteral(node.value, state);
        } else if (isIdentifier(node)) {
            this.visitIdentifier(node.name, state);
        } else if (isReturnStatement(node)) {
            this.visitReturn(state);
        } else if (isBinaryExpression(node)) {
            this.visitBinaryExpression(node.operator, state);
        } else if (isIfStatement(node)) {
            this.visitIfStatement(node, parent, state);
        } else if (isBlockStatement(node)) {
            this.visitBlockStatement(state, parent);
        } else {
            throw new Error(`Unknown node of type ${node.type} visited`);
        }
    }

    private visitNumericLiteral(value: number, state: VisitorState) {
        state.expressionStack.push(this.module.i32.const(value));
    }

    private visitBooleanLiteral(value: boolean, state: VisitorState) {
        state.expressionStack.push(this.module.i32.const(value ? 1 : 0));
    }

    private visitIdentifier(name: string, state: VisitorState) {
        const index = this.parameterMapping.get(name);

        if (index === undefined) {
            throw new Error(`Unknown identifier ${name}`);
        }

        state.expressionStack.push(this.module.getLocal(index, i32));
    }

    private visitReturn(state: VisitorState) {
        state.statements.push(this.module.return(state.expressionStack.pop()));
    }

    private visitBinaryExpression(operator: string, state: VisitorState) {
        const right = state.expressionStack.pop();
        const left = state.expressionStack.pop();

        if (left === undefined || right === undefined) {
            throw new Error('Malformed AST');
        }

        switch (operator) {
            case '+':
                state.expressionStack.push(this.module.i32.add(left, right));
                break;
            case '-':
                state.expressionStack.push(this.module.i32.sub(left, right));
                break;
            default:
                throw new Error(`Unhandled operator ${operator}`);
        }
    }

    private visitIfStatement(node: IfStatement, parent: TraversalAncestors, state: VisitorState) {
        const condition = state.expressionStack.pop();

        if (condition === undefined) {
            throw new Error('Undefined condition in if statement');
        }

        const branches = state.branches.get(node);

        if (branches === undefined) {
            throw new Error('Missing branch statement');
        }

        const [ifPart, elsePart] = branches;
        const ifStatement = this.module.if(condition, ifPart, elsePart);
        const immediateParent = Generator.getImmediateParent(parent);

        if (immediateParent !== undefined && isIfStatement(immediateParent)) {
            const parentBranches = state.branches.get(immediateParent);

            if (parentBranches === undefined) {
                throw Error('Parent branches are undefined');
            }

            parentBranches[1] = ifStatement;
            state.branches.set(immediateParent, parentBranches);
        } else {
            state.statements.push(ifStatement);
        }
    }

    private visitBlockStatement(state: VisitorState, parent: TraversalAncestors) {
        const block = this.module.block('', state.statements);
        state.statements = []; // clear all current statements

        const immediateParent = Generator.getImmediateParent(parent);

        if (immediateParent !== undefined && isIfStatement(immediateParent)) {
            const parentBranches = state.branches.get(immediateParent);

            if (parentBranches === undefined) {
                state.branches.set(immediateParent, [block, undefined]);
            } else {
                parentBranches[1] = block;
            }
        } else {
            state.body = block; // top statement block
        }
    }
}

export default Generator;
