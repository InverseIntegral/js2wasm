import {
    BinaryExpression,
    BlockStatement,
    BooleanLiteral, FunctionExpression,
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

    private statements: Statement[][] = [];
    private expressions: Expression[] = [];
    private currentBlock: Statement;

    constructor(module: Module, parameterMapping: Map<string, number>) {
        super();
        this.module = module;
        this.parameterMapping = parameterMapping;
    }

    public run(tree: FunctionExpression): Statement {
        this.visit(tree.body);
        return this.currentBlock;
    }

    protected visitIdentifier(node: Identifier) {
        const index = this.parameterMapping.get(node.name);

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
        const argument = node.argument;

        if (argument !== null) {
            this.visit(argument);
        }

        const returnStatement = this.module.return(this.expressions.pop());
        this.statements[this.statements.length - 1].push(returnStatement);
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
        this.visit(node.left);
        this.visit(node.right);
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

        this.statements[this.statements.length - 1].push(ifStatement);
        this.currentBlock = ifStatement;
    }

    protected visitBlockStatement(node: BlockStatement) {
        this.statements.push([]);

        for (const statement of node.body) {
            this.visit(statement);
        }

        const statements = this.statements.pop();

        if (statements === undefined) {
            throw new Error('Statement stack is empty');
        }

        this.currentBlock = this.module.block('', statements);
    }

}

export default GeneratorVisitor;
