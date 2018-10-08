import {
    BinaryExpression,
    BlockStatement,
    BooleanLiteral,
    Identifier,
    IfStatement,
    NumericLiteral,
    ReturnStatement,
    UnaryExpression,
} from '@babel/types';
import {Expression, i32, Module, Statement} from 'binaryen';
import Visitor from '../visitor';

class GeneratorVisitor extends Visitor {

    private readonly module: Module;
    private readonly parameterMapping: Map<string, number>;

    private statements: Statement[] = [];
    private expressions: Expression[] = [];


    constructor(module: Module, parameterMapping: Map<string, number>) {
        super();
        this.module = module;
        this.parameterMapping = parameterMapping;
    }

    protected visitIdentifier(node: Identifier) {
        const index = this.parameterMapping.get(name);

        if (index === undefined) {
            throw new Error(`Unknown identifier ${name}`);
        }

        this.expressions.push(this.module.getLocal(index, i32));
    }

    protected visitNumericLiteral(node: NumericLiteral) {
        this.expressions.push(this.module.i32.const(node.value));
    }

    protected visitBooleanLiteral(node: BooleanLiteral) {

    }

    protected visitReturnStatement(node: ReturnStatement) {

    }

    protected visitUnaryExpression(node: UnaryExpression) {
        this.visit(node.argument);
        const operand = this.expressions.pop();

        if (operand === undefined) {
            throw new Error('Malformed AST');
        }

        switch (node.operator) {
            case '+':
                this.expressions.push(operand);
                break;
            case '-':
                this.expressions.push(this.module.i32.sub(this.module.i32.const(0), operand));
                break;
            case '!':
                this.expressions.push(this.module.i32.rem_s(
                    this.module.i32.add(operand, this.module.i32.const(1)), this.module.i32.const(2)));
                break;
            default:
                throw new Error(`Unhandled operator ${node.operator}`);
        }
    }

    protected visitBinaryExpression(node: BinaryExpression) {

    }

    protected visitIfStatement(node: IfStatement) {

    }

    protected visitBlockStatement(node: BlockStatement) {

    }

}

export default GeneratorVisitor;
