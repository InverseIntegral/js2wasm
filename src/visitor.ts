import {
    BinaryExpression, BlockStatement,
    BooleanLiteral,
    Identifier, IfStatement, isBinaryExpression, isBlockStatement,
    isBooleanLiteral,
    isIdentifier, isIfStatement,
    isLogicalExpression,
    isNumericLiteral,
    isReturnStatement,
    isUnaryExpression,
    Node, NumericLiteral, ReturnStatement, UnaryExpression
} from '@babel/types';
import {LogicalExpression} from '@babel/types';

abstract class Visitor {

    public visit(node: Node) {
        if (isNumericLiteral(node)) {
            this.visitNumericLiteral(node);
        } else if (isBooleanLiteral(node)) {
            this.visitBooleanLiteral(node);
        } else if (isIdentifier(node)) {
            this.visitIdentifier(node);
        } else if (isReturnStatement(node)) {
            this.visitReturnStatement(node);
        } else if (isUnaryExpression(node)) {
            this.visitUnaryExpression(node);
        } else if (isBinaryExpression(node)) {
            this.visitBinaryExpression(node);
        } else if (isLogicalExpression(node)) {
            this.visitLogicalExpression(node);
        } else if (isIfStatement(node)) {
            this.visitIfStatement(node);
        } else if (isBlockStatement(node)) {
            this.visitBlockStatement(node);
        } else {
            throw new Error(`Unknown node of type ${node.type} visited`);
        }
    }

    // noinspection TsLint
    protected visitIdentifier(node: Identifier) {

    }

    // noinspection TsLint
    protected visitNumericLiteral(node: NumericLiteral) {

    }

    // noinspection TsLint
    protected visitBooleanLiteral(node: BooleanLiteral) {

    }

    // noinspection TsLint
    protected visitReturnStatement(node: ReturnStatement) {

    }

    // noinspection TsLint
    protected visitUnaryExpression(node: UnaryExpression) {

    }

    // noinspection TsLint
    protected visitBinaryExpression(node: BinaryExpression) {

    }

    protected visitLogicalExpression(node: LogicalExpression) {
        this.visit(node.left);
        this.visit(node.right);
    }

    // noinspection TsLint
    protected visitIfStatement(node: IfStatement) {

    }

    // noinspection TsLint
    protected visitBlockStatement(node: BlockStatement) {

    }
}

export default Visitor;
