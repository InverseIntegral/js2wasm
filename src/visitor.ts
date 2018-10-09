import {
    AssignmentExpression,
    BinaryExpression,
    BlockStatement,
    BooleanLiteral,
    ExpressionStatement,
    Identifier,
    IfStatement,
    isAssignmentExpression,
    isBinaryExpression,
    isBlockStatement,
    isBooleanLiteral,
    isExpressionStatement,
    isIdentifier,
    isIfStatement,
    isNumericLiteral,
    isReturnStatement,
    isUnaryExpression,
    isVariableDeclaration,
    isVariableDeclarator,
    Node,
    NumericLiteral,
    ReturnStatement,
    UnaryExpression,
    VariableDeclaration,
    VariableDeclarator
} from '@babel/types';

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
        } else if (isIfStatement(node)) {
            this.visitIfStatement(node);
        } else if (isBlockStatement(node)) {
            this.visitBlockStatement(node);
        } else if (isVariableDeclaration(node)) {
            this.visitVariableDeclaration(node);
        } else if (isVariableDeclarator(node)) {
            this.visitVariableDeclarator(node);
        } else if (isExpressionStatement(node)) {
            this.visitExpressionStatement(node);
        } else if (isAssignmentExpression(node)) {
            this.visitAssignmentExpression(node);
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

    protected visitReturnStatement(node: ReturnStatement) {
        const argument = node.argument;

        if (argument !== null) {
            this.visit(argument);
        }
    }

    protected visitUnaryExpression(node: UnaryExpression) {
        this.visit(node.argument);
    }

    protected visitBinaryExpression(node: BinaryExpression) {
        this.visit(node.left);
        this.visit(node.right);
    }

    protected visitIfStatement(node: IfStatement) {
        this.visit(node.test);
        this.visit(node.consequent);

        if (node.alternate !== null) {
            this.visit(node.alternate);
        }
    }

    protected visitBlockStatement(node: BlockStatement) {
        for (const statement of node.body) {
            this.visit(statement);
        }
    }

    protected visitVariableDeclaration(node: VariableDeclaration) {
        for (const declarator of node.declarations) {
            this.visit(declarator);
        }
    }

    // noinspection TsLint
    protected visitVariableDeclarator(node: VariableDeclarator) {

    }

    protected visitExpressionStatement(node: ExpressionStatement) {
        this.visit(node.expression);
    }

    protected visitAssignmentExpression(node: AssignmentExpression) {
        this.visit(node.left);
        this.visit(node.right);
    }
}

export default Visitor;
