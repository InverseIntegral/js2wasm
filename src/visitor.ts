import {
    AssignmentExpression,
    BinaryExpression,
    BlockStatement,
    BooleanLiteral, CallExpression,
    ExpressionStatement,
    Identifier,
    IfStatement,
    isAssignmentExpression,
    isBinaryExpression,
    isBlockStatement,
    isBooleanLiteral, isCallExpression,
    isExpressionStatement,
    isIdentifier,
    isIfStatement,
    isLogicalExpression, isMemberExpression,
    isNumericLiteral,
    isReturnStatement,
    isUnaryExpression,
    isUpdateExpression,
    isVariableDeclaration,
    isVariableDeclarator,
    isWhileStatement,
    LogicalExpression, MemberExpression,
    Node,
    NumericLiteral,
    ReturnStatement,
    UnaryExpression,
    UpdateExpression,
    VariableDeclaration,
    VariableDeclarator,
    WhileStatement,
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
        } else if (isLogicalExpression(node)) {
            this.visitLogicalExpression(node);
        } else if (isUpdateExpression(node)) {
            this.visitUpdateExpression(node);
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
        } else if (isWhileStatement(node)) {
            this.visitWhileStatement(node);
        } else if (isCallExpression(node)) {
            this.visitCallExpression(node);
        } else if (isMemberExpression(node)) {
            this.visitMemberExpression(node);
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

    protected visitLogicalExpression(node: LogicalExpression) {
        this.visit(node.left);
        this.visit(node.right);
    }

    protected visitUpdateExpression(node: UpdateExpression) {
        this.visit(node.argument);
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

    protected visitVariableDeclarator(node: VariableDeclarator) {
        if (node.init !== null) {
            this.visit(node.init);
        }
    }

    protected visitExpressionStatement(node: ExpressionStatement) {
        this.visit(node.expression);
    }

    protected visitAssignmentExpression(node: AssignmentExpression) {
        this.visit(node.left);
        this.visit(node.right);
    }

    protected visitWhileStatement(node: WhileStatement) {
        this.visit(node.test);
        this.visit(node.body);
    }

    protected visitCallExpression(node: CallExpression) {
        for (const argument of node.arguments) {
            this.visit(argument);
        }

        this.visit(node.callee);
    }

    protected visitMemberExpression(node: MemberExpression) {
        this.visit(node.object);
        this.visit(node.property);
    }
}

export default Visitor;
