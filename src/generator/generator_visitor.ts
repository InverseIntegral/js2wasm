import {
    AssignmentExpression,
    BinaryExpression,
    BlockStatement,
    BooleanLiteral,
    CallExpression,
    ExpressionStatement,
    FunctionDeclaration,
    Identifier,
    IfStatement,
    isAssignmentExpression,
    isIdentifier,
    isUpdateExpression,
    LogicalExpression,
    LVal,
    NumericLiteral,
    ReturnStatement,
    UnaryExpression,
    UpdateExpression,
    VariableDeclarator,
} from '@babel/types';
import {Expression, i32, Module, Statement} from 'binaryen';
import Visitor from '../visitor';

class GeneratorVisitor extends Visitor {

    private readonly module: Module;
    private readonly variableMapping: Map<string, number>;

    private statements: Statement[] = [];
    private expressions: Expression[] = [];
    private currentBlock: Statement;

    constructor(module: Module, variableMapping: Map<string, number>) {
        super();
        this.module = module;
        this.variableMapping = variableMapping;
    }

    public run(tree: FunctionDeclaration): Statement {
        this.visit(tree.body);
        return this.currentBlock;
    }

    protected visitIdentifier(node: Identifier) {
        const index = this.getVariableIndex(node.name);

        this.expressions.push(this.module.getLocal(index, i32));
    }

    protected visitNumericLiteral(node: NumericLiteral) {
        this.expressions.push(this.module.i32.const(node.value));
    }

    protected visitBooleanLiteral(node: BooleanLiteral) {
        this.expressions.push(this.module.i32.const(node.value ? 1 : 0));
    }

    protected visitReturnStatement(node: ReturnStatement) {
        super.visitReturnStatement(node);

        const returnStatement = this.module.return(this.expressions.pop());
        this.statements.push(returnStatement);
    }

    protected visitUnaryExpression(node: UnaryExpression) {
        super.visitUnaryExpression(node);

        const operand = this.popExpression();

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
        super.visitBinaryExpression(node);

        const right = this.popExpression();
        const left = this.popExpression();

        switch (node.operator) {
            case '+':
                this.expressions.push(this.module.i32.add(left, right));
                break;
            case '-':
                this.expressions.push(this.module.i32.sub(left, right));
                break;
            case '*':
                this.expressions.push(this.module.i32.mul(left, right));
                break;
            case '/':
                this.expressions.push(this.module.i32.div_s(left, right));
                break;
            case '%':
                this.expressions.push(this.module.i32.rem_s(left, right));
                break;
            case '==':
                this.expressions.push(this.module.i32.eq(left, right));
                break;
            case '!=':
                this.expressions.push(this.module.i32.ne(left, right));
                break;
            case '<':
                this.expressions.push(this.module.i32.lt_s(left, right));
                break;
            case '<=':
                this.expressions.push(this.module.i32.le_s(left, right));
                break;
            case '>':
                this.expressions.push(this.module.i32.gt_s(left, right));
                break;
            case '>=':
                this.expressions.push(this.module.i32.ge_s(left, right));
                break;
            default:
                throw new Error(`Unhandled operator ${node.operator}`);
        }
    }

    protected visitLogicalExpression(node: LogicalExpression) {
        super.visitLogicalExpression(node);

        const right = this.popExpression();
        const left = this.popExpression();

        switch (node.operator) {
            case '&&':
                this.expressions.push(this.module.select(left, right, this.module.i32.const(0)));
                break;
            case '||':
                this.expressions.push(this.module.select(left, this.module.i32.const(1), right));
                break;
            default:
                throw new Error(`Unhandled operator ${node.operator}`);
        }
    }

    protected visitUpdateExpression(node: UpdateExpression) {
        super.visitUpdateExpression(node);

        const currentValue = this.popExpression();

        if (!(isIdentifier(node.argument))) {
            throw new Error('An update is only allowed on an identifier');
        }

        const index = this.getVariableIndex(node.argument.name);

        switch (node.operator) {
            case '++':
                this.statements.push(this.module.set_local(index,
                    this.module.i32.add(currentValue, this.module.i32.const(1))));
                break;
            case '--':
                this.statements.push(this.module.set_local(index,
                    this.module.i32.sub(currentValue, this.module.i32.const(1))));
                break;
            default:
                throw new Error(`Unhandled operator ${node.operator}`);
        }
    }

    protected visitIfStatement(node: IfStatement) {
        this.visit(node.test);
        const condition = this.popExpression();

        this.visit(node.consequent);

        const ifPart = this.currentBlock;
        let elsePart;

        if (node.alternate !== null) {
            const previousStatements = this.statements;
            this.statements = [];

            this.visit(node.alternate);
            elsePart = this.currentBlock;

            this.statements = previousStatements;
        }

        const ifStatement = this.module.if(condition, ifPart, elsePart);

        this.statements.push(ifStatement);
        this.currentBlock = ifStatement;
    }

    protected visitBlockStatement(node: BlockStatement) {
        const previousStatements = this.statements;
        this.statements = [];

        super.visitBlockStatement(node);

        this.currentBlock = this.module.block('', this.statements);
        this.statements = previousStatements;
    }

    protected visitVariableDeclarator(node: VariableDeclarator) {
        if (node.init !== null) {
            this.visit(node.init);
            this.createSetLocal(node.id);
        }
    }

    protected visitAssignmentExpression(node: AssignmentExpression) {
        this.visit(node.right);

        if (node.operator !== '=') {
            this.handleShorthandAssignment(node);
        }

        this.createSetLocal(node.left);
    }

    protected visitCallExpression(node: CallExpression): void {
        if (!isIdentifier(node.callee)) {
            throw new Error('Callee is not an identifier');
        }

        const parameterExpressions = [];

        for (const argument of node.arguments) {
            this.visit(argument);
            parameterExpressions.push(this.popExpression());
        }

        this.expressions.push(this.module.call(node.callee.name, parameterExpressions, i32));
    }


    protected visitExpressionStatement(node: ExpressionStatement): void {
        super.visitExpressionStatement(node);

        // Update and assignment expressions already generate a complete statement
        if (!isUpdateExpression(node.expression) && !isAssignmentExpression((node.expression))) {
            this.statements.push(this.module.drop(this.popExpression()));
        }
    }

    private popExpression() {
        const expression = this.expressions.pop();

        if (expression === undefined) {
            throw new Error('Expression is undefined');
        }

        return expression;
    }

    private handleShorthandAssignment(node: AssignmentExpression) {
        this.visit(node.left);
        const currentValue = this.popExpression();
        const assignedValue = this.popExpression();

        switch (node.operator) {
            case '+=':
                this.expressions.push(this.module.i32.add(currentValue, assignedValue));
                break;
            case '-=':
                this.expressions.push(this.module.i32.sub(currentValue, assignedValue));
                break;
            case '*=':
                this.expressions.push(this.module.i32.mul(currentValue, assignedValue));
                break;
            case '/=':
                this.expressions.push(this.module.i32.div_s(currentValue, assignedValue));
                break;
            default:
                throw new Error(`Unhandled operator ${node.operator}`);
        }
    }

    private createSetLocal(val: LVal) {
        const value = this.popExpression();

        if (isIdentifier(val)) {
            const id = this.variableMapping.get(val.name);

            if (id === undefined) {
                throw new Error('Assigned to unknown variable');
            }

            this.statements.push(this.module.set_local(id, value));
        } else {
            throw new Error('Assignment to non-identifier');
        }
    }

    private getVariableIndex(name: string) {
        const index = this.variableMapping.get(name);

        if (index === undefined) {
            throw new Error(`Unknown identifier ${name}`);
        }

        return index;
    }
}

export default GeneratorVisitor;
