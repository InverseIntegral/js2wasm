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
import {Expression, Module, Statement} from 'binaryen';
import Visitor from '../visitor';

class GeneratorVisitor extends Visitor {

    private readonly module: Module;

    private statements: Statement[] = [];
    private expressions: Expression[] = [];


    constructor(module: Module) {
        super();
        this.module = module;
    }

    protected visitIdentifier(node: Identifier) {

    }

    protected visitNumericLiteral(node: NumericLiteral) {
        this.expressions.push(this.module.i32.const(node.value));
    }

    protected visitBooleanLiteral(node: BooleanLiteral) {

    }

    protected visitReturnStatement(node: ReturnStatement) {

    }

    protected visitUnaryExpression(node: UnaryExpression) {

    }

    protected visitBinaryExpression(node: BinaryExpression) {

    }

    protected visitIfStatement(node: IfStatement) {

    }

    protected visitBlockStatement(node: BlockStatement) {

    }

}

export default GeneratorVisitor;
