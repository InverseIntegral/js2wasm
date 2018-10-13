import {
    AssignmentExpression,
    BinaryExpression,
    BlockStatement,
    BooleanLiteral,
    FunctionExpression,
    Identifier,
    IfStatement,
    isIdentifier,
    isIfStatement,
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

    private statements: Statement[][] = [];
    private expressions: Expression[] = [];
    private currentBlock: Statement;

    constructor(module: Module, variableMapping: Map<string, number>) {
        super();
        this.module = module;
        this.variableMapping = variableMapping;
    }

    public run(tree: FunctionExpression): Statement {
        this.visit(tree.body);
        return this.currentBlock;
    }

    protected visitIdentifier(node: Identifier) {
        const index = this.variableMapping.get(node.name);

        if (index === undefined) {
            throw new Error(`Unknown identifier ${node.name}`);
        }

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
        this.appendStatement(returnStatement);
    }

    protected visitUnaryExpression(node: UnaryExpression) {
        super.visitUnaryExpression(node);

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
        super.visitBinaryExpression(node);

        const right = this.expressions.pop();
        const left = this.expressions.pop();

        if (left === undefined || right === undefined) {
            throw new Error('Left or right expression of binary operation is undefined');
        }

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

    protected visitUpdateExpression(node: UpdateExpression) {
        super.visitUpdateExpression(node);

        const currentValue = this.expressions.pop();

        if (currentValue === undefined || !(isIdentifier(node.argument))) {
            throw new Error('An update is only allowed on an identifier');
        }

        const index = this.variableMapping.get(node.argument.name) as number;

        switch (node.operator) {
            case '++':
                this.appendStatement(this.module.set_local(index,
                    this.module.i32.add(currentValue, this.module.i32.const(1))));
                break;
            default:
                throw new Error(`Unhandled operator ${node.operator}`);
        }
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

            // If the else part is an IfStatementNode then we can remove the statement
            if (isIfStatement(node.alternate)) {
                this.statements[this.statements.length - 1].pop();
            }
        }

        const ifStatement = this.module.if(condition, ifPart, elsePart);

        this.appendStatement(ifStatement);
        this.currentBlock = ifStatement;
    }

    protected visitBlockStatement(node: BlockStatement) {
        this.statements.push([]);

        super.visitBlockStatement(node);

        const statements = this.statements.pop();

        if (statements === undefined) {
            throw new Error('Statement stack is empty');
        }

        this.currentBlock = this.module.block('', statements);
    }

    protected visitVariableDeclarator(node: VariableDeclarator) {
        if (node.init !== null) {
            this.visit(node.init);
            this.createSetLocal(node.id);
        }
    }

    protected visitAssignmentExpression(node: AssignmentExpression) {
        this.visit(node.right);
        this.createSetLocal(node.left);
    }

    private createSetLocal(val: LVal) {
        const value = this.expressions.pop();

        if (value === undefined) {
            throw new Error('Assigned undefined expression');
        }

        if (isIdentifier(val)) {
            const id = this.variableMapping.get(val.name);

            if (id === undefined) {
                throw new Error('Assigned to unknown variable');
            }

            this.appendStatement(this.module.set_local(id, value));
        } else {
            throw new Error('Assignment to non-identifier');
        }
    }

    private appendStatement(statement: Statement) {
        this.statements[this.statements.length - 1].push(statement);
    }
}

export default GeneratorVisitor;
