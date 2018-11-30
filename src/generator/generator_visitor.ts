import {
    AssignmentExpression,
    BinaryExpression,
    BlockStatement,
    BooleanLiteral,
    CallExpression,
    Expression as BabelExpression,
    ExpressionStatement,
    ForStatement,
    FunctionDeclaration,
    Identifier,
    IfStatement,
    isAssignmentExpression,
    isIdentifier,
    isMemberExpression,
    isUpdateExpression,
    LogicalExpression,
    LVal,
    MemberExpression,
    NumericLiteral,
    ReturnStatement,
    UnaryExpression,
    UpdateExpression,
    VariableDeclarator,
    WhileStatement,
} from '@babel/types';
import {Expression, i32, Module, Statement} from 'binaryen';
import Visitor from '../visitor';
import {VariableMapping} from './declaration_visitor';
import {ExpressionTypes} from './type_inference_visitor';
import {getCommonNumberType, toBinaryenType, WebAssemblyType} from './wasm_type';

type BinaryExpressionFunction = (e1: Expression, e2: Expression) => Expression;

class GeneratorVisitor extends Visitor {

    private readonly module: Module;
    private readonly variableMapping: VariableMapping;
    private readonly expressionTypes: ExpressionTypes;

    private statements: Statement[] = [];
    private expressions: Expression[] = [];

    private labelCounter: number = 0;

    constructor(module: Module,
                variableMapping: VariableMapping,
                expressionType: ExpressionTypes) {

        super();
        this.module = module;
        this.variableMapping = variableMapping;
        this.expressionTypes = expressionType;
    }

    public run(tree: FunctionDeclaration): Statement {
        this.visit(tree.body);
        return this.popStatement();
    }

    protected visitIdentifier(node: Identifier) {
        const index = this.getVariableIndex(node.name);

        this.expressions.push(this.module.getLocal(index, toBinaryenType(this.getExpressionType(node))));
    }

    protected visitNumericLiteral(node: NumericLiteral) {
        const instance = this.getOperationsInstance(this.getExpressionType(node));

        this.expressions.push(instance.const(node.value));
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
                const instance = this.getOperationsInstance(this.getExpressionType(node));

                this.expressions.push(instance.sub(instance.const(0), operand));
                break;
            case '!':
                this.expressions.push(this.module.i32.eqz(operand));
                break;
            default:
                throw new Error(`Unhandled operator ${node.operator}`);
        }
    }

    protected visitBinaryExpression(node: BinaryExpression) {
        super.visitBinaryExpression(node);

        switch (node.operator) {
            case '+':
                this.expressions.push(this.executeBinaryOperation(node, this.module.i32.add, this.module.f64.add));
                break;
            case '-':
                this.expressions.push(this.executeBinaryOperation(node, this.module.i32.sub, this.module.f64.sub));
                break;
            case '*':
                this.expressions.push(this.executeBinaryOperation(node, this.module.i32.mul, this.module.f64.mul));
                break;
            case '/':
                this.expressions.push(this.executeBinaryOperation(node, this.module.i32.div_s, this.module.f64.div));
                break;
            case '%':
                const right = this.popExpression();
                const left = this.popExpression();

                const rightType = this.getExpressionType(node.right);
                const leftType = this.getExpressionType(node.left);
                const commonNumberType = getCommonNumberType(leftType, rightType);

                if (commonNumberType === WebAssemblyType.INT_32) {
                    this.expressions.push(this.module.i32.rem_s(left, right));
                } else {
                    throw new Error('Modulo is not allowed with float values');
                }

                break;
            case '==':
                this.expressions.push(this.executeBinaryOperation(node, this.module.i32.eq, this.module.f64.eq));
                break;
            case '!=':
                this.expressions.push(this.executeBinaryOperation(node, this.module.i32.ne, this.module.f64.ne));
                break;
            case '<':
                this.expressions.push(this.executeBinaryOperation(node, this.module.i32.lt_s, this.module.f64.lt));
                break;
            case '<=':
                this.expressions.push(this.executeBinaryOperation(node, this.module.i32.le_s, this.module.f64.le));
                break;
            case '>':
                this.expressions.push(this.executeBinaryOperation(node, this.module.i32.gt_s, this.module.f64.gt));
                break;
            case '>=':
                this.expressions.push(this.executeBinaryOperation(node, this.module.i32.ge_s, this.module.f64.ge));
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
        let updatedValue;

        const instance = this.getOperationsInstance(this.getExpressionType(node));

        switch (node.operator) {
            case '++':
                updatedValue = instance.add(currentValue, instance.const(1));
                break;
            case '--':
                updatedValue = instance.sub(currentValue, instance.const(1));
                break;
            default:
                throw new Error(`Unhandled operator ${node.operator}`);
        }

        if (isIdentifier(node.argument)) {
            this.statements.push(this.setLocal(node.argument, updatedValue));
        } else if (isMemberExpression(node.argument)) {
            this.statements.push(this.setArrayElement(node.argument, updatedValue));
        } else {
            throw new Error('An update is only allowed on an identifier or a member access');
        }
    }

    protected visitIfStatement(node: IfStatement) {
        this.visit(node.test);
        const condition = this.popExpression();

        this.visit(node.consequent);

        const ifPart = this.popStatement();
        let elsePart;

        if (node.alternate !== null) {
            const previousStatements = this.statements;
            this.statements = [];

            this.visit(node.alternate);
            elsePart = this.popStatement();

            this.statements = previousStatements;
        }

        const ifStatement = this.module.if(condition, ifPart, elsePart);

        this.statements.push(ifStatement);
    }

    protected visitBlockStatement(node: BlockStatement) {
        const previousStatements = this.statements;
        this.statements = [];

        super.visitBlockStatement(node);

        const block = this.module.block('', this.statements);
        this.statements = previousStatements;
        this.statements.push(block);
    }

    protected visitVariableDeclarator(node: VariableDeclarator) {
        if (node.init !== null) {
            this.visit(node.init);
            this.handleAssignment(node.id);
        }
    }

    protected visitAssignmentExpression(node: AssignmentExpression) {
        this.visit(node.right);

        if (node.operator !== '=') {
            this.handleShorthandAssignment(node);
        }

        this.handleAssignment(node.left);
    }

    protected visitWhileStatement(node: WhileStatement) {
        super.visitWhileStatement(node);
        this.statements.push(this.createLoopStatement(this.popExpression()));
    }

    protected visitForStatement(node: ForStatement) {
        super.visitForStatement(node);

        let updateStatement;

        if (node.update !== null) {
            updateStatement = this.popStatement();
        }

        let condition = this.module.i32.const(1);

        if (node.test !== null) {
            condition = this.popExpression();
        }

        this.statements.push(this.createLoopStatement(condition, updateStatement));
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

    protected visitExpressionStatement(node: ExpressionStatement) {
        super.visitExpressionStatement(node);

        // Update and assignment expressions already generate a complete statement
        if (!isUpdateExpression(node.expression) && !isAssignmentExpression((node.expression))) {
            this.statements.push(this.module.drop(this.popExpression()));
        }
    }

    protected visitMemberExpression(node: MemberExpression) {
        if (node.computed) {
            this.expressions.push(this.getArrayElement(node));
        } else {
            const identifier = node.property;

            if (identifier.name === 'length') {
                this.expressions.push(this.getArrayLength(node));
            } else {
                throw new Error(`Unknown property ${identifier}`);
            }
        }
    }

    private popExpression() {
        const expression = this.expressions.pop();

        if (expression === undefined) {
            throw new Error('Expression is undefined');
        }

        return expression;
    }

    private popStatement() {
        const statement = this.statements.pop();

        if (statement === undefined) {
            throw new Error('Statement is undefined');
        }

        return statement;
    }

    private handleShorthandAssignment(node: AssignmentExpression) {
        const right = this.popExpression();
        this.visit(node.left);
        this.expressions.push(right);

        switch (node.operator) {
            case '+=':
                this.expressions.push(this.executeBinaryOperation(node, this.module.i32.add, this.module.f64.add));
                break;
            case '-=':
                this.expressions.push(this.executeBinaryOperation(node, this.module.i32.sub, this.module.f64.sub));
                break;
            case '*=':
                this.expressions.push(this.executeBinaryOperation(node, this.module.i32.mul, this.module.f64.mul));
                break;
            case '/=':
                this.expressions.push(this.executeBinaryOperation(node, this.module.i32.div_s, this.module.f64.div));
                break;
            default:
                throw new Error(`Unhandled operator ${node.operator}`);
        }
    }

    private executeBinaryOperation(node: BinaryExpression | AssignmentExpression,
                                   i32operation: BinaryExpressionFunction,
                                   f64operation: BinaryExpressionFunction) {

        let right = this.popExpression();
        let left = this.popExpression();

        if (isAssignmentExpression(node) && !isIdentifier(node.left) && !isMemberExpression(node.left)) {
            throw new Error('Shorthand assignment only allowed on an identifier or an array member');
        }

        const rightType = this.getExpressionType(node.right);
        // @ts-ignore the analyser doesn't recognise the check
        const leftType = this.getExpressionType(node.left);
        const commonNumberType = getCommonNumberType(leftType, rightType);

        left = this.convertType(left, leftType, commonNumberType);
        right = this.convertType(right, rightType, commonNumberType);

        if (commonNumberType === WebAssemblyType.INT_32) {
            return i32operation(left, right);
        } else if (commonNumberType === WebAssemblyType.FLOAT_64) {
            return f64operation(left, right);
        } else {
            throw new Error(`Operation ${node.operator} not supported on type ${WebAssemblyType[commonNumberType]}`);
        }
    }

    private handleAssignment(val: LVal) {
        const value = this.popExpression();

        if (isIdentifier(val)) {
            this.statements.push(this.setLocal(val, value));
        } else if (isMemberExpression(val)) {
            this.statements.push(this.setArrayElement(val, value));
        } else {
            throw new Error('Assignment to non-identifier or member expression');
        }
    }

    private createLoopStatement(condition: Expression, update?: Statement) {
        const endLabel = this.generateLabel();
        const beginLabel = this.generateLabel();

        const conditionBranch = this.module.br_if(endLabel, this.module.i32.eqz(condition));
        const loopBranch = this.module.br(beginLabel);
        const loopBody = this.popStatement();

        const children: Statement[] = [conditionBranch, loopBody];

        if (update !== undefined) {
            children.push(update);
        }

        children.push(loopBranch);

        const loopBlock = this.module.block(endLabel, children);
        return this.module.loop(beginLabel, loopBlock);
    }

    private setLocal(val: Identifier, value: Expression) {
        return this.module.set_local(this.getVariableIndex(val.name), value);
    }

    private getArrayElement(node: MemberExpression) {
        super.visitMemberExpression(node);

        // The offset can not be used, because the memberaccess value can also be a mathematical term or a variable
        return this.module.i32.load(0, 4, this.getPointer());
    }

    private getArrayLength(node: MemberExpression) {
        this.visit(node.object);

        const address = this.module.i32.sub(this.popExpression(), this.module.i32.const(4));
        return this.module.i32.load(0, 4, address);
    }

    private setArrayElement(memberExpression: MemberExpression, value: Expression): Statement {
        this.visit(memberExpression.object);
        this.visit(memberExpression.property);

        // @ts-ignore because store() returns an expression
        return this.module.i32.store(0, 4, this.getPointer(), value);
    }

    private getVariableIndex(name: string) {
        const index = this.variableMapping.get(name);

        if (index === undefined) {
            throw new Error(`Unknown identifier ${name}`);
        }

        return index;
    }

    private getPointer() {
        const index = this.popExpression();
        const basePointer = this.popExpression();

        return this.module.i32.add(basePointer, this.module.i32.mul(index, this.module.i32.const(4)));
    }

    private generateLabel() {
        return 'label_' + this.labelCounter++;
    }

    private getOperationsInstance(type: WebAssemblyType) {
        if (type === WebAssemblyType.FLOAT_64) {
            return this.module.f64;
        } else {
            return this.module.i32;
        }
    }

    private getExpressionType(expression: BabelExpression) {
        const type = this.expressionTypes.get(expression);

        if (type === undefined) {
            throw new Error(`Expression type of ${expression.type} not defined`);
        }

        return type;
    }

    private convertType(expression: Expression, from: WebAssemblyType, to: WebAssemblyType) {
        if (from !== to) {
            if (from === WebAssemblyType.INT_32 && to === WebAssemblyType.FLOAT_64) {
                return this.module.f64.convert_s.i32(expression);
            } else {
                throw new Error('Unsupported conversion performed');
            }
        }

        return expression;
    }
}

export default GeneratorVisitor;
