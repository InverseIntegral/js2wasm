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
    private currentBlock: Statement;

    constructor(module: Module) {
        super();
        this.module = module;
    }

    protected visitIdentifier(node: Identifier) {

    }

    protected visitNumericLiteral(node: NumericLiteral) {

    }

    protected visitBooleanLiteral(node: BooleanLiteral) {
        this.expressions.push(this.module.i32.const(node.value ? 1 : 0));
    }

    protected visitReturnStatement(node: ReturnStatement) {
        const argument = node.argument;

        if (argument !== null) {
            this.visit(argument);
        }

        this.module.return(this.expressions.pop());
    }

    protected visitUnaryExpression(node: UnaryExpression) {

    }

    protected visitBinaryExpression(node: BinaryExpression) {

    }

    protected visitIfStatement(node: IfStatement) {
        this.visit(node.test);
        const condition = this.expressions.pop();

        if (condition === undefined) {
            throw new Error('Missing condition expression');
        }

        this.visit(node.consequent);

        const ifPart = this.currentBlock;
        let elsePart;

        if (node.alternate !== null) {
            this.visit(node.alternate);
            elsePart = this.currentBlock;
        }

        const ifStatement = this.module.if(condition, ifPart, elsePart);
        this.statements.push(ifStatement);
    }

    protected visitBlockStatement(node: BlockStatement) {
        for (const statement of node.body) {
            this.visit(statement);
        }

        this.currentBlock = this.module.block('', this.statements);
        this.statements = [];
    }

}

export default GeneratorVisitor;
