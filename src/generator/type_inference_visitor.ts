import {
    AssignmentExpression,
    BinaryExpression,
    BooleanLiteral,
    CallExpression,
    Expression,
    FunctionDeclaration,
    Identifier,
    isIdentifier,
    isMemberExpression,
    LogicalExpression,
    MemberExpression,
    NumericLiteral,
    UnaryExpression,
    UpdateExpression,
    VariableDeclarator,
} from '@babel/types';
import Visitor from '../visitor';
import {FunctionSignature, FunctionSignatures} from './generator';
import {getCommonNumberType, getNumberType, WebAssemblyType} from './wasm_type';

type ExpressionTypes = Map<Expression, WebAssemblyType>;
type VariableTypes = Map<string, WebAssemblyType>;

class TypeInferenceVisitor extends Visitor {

    private signatures: FunctionSignatures;
    private expressionTypes: ExpressionTypes = new Map();
    private identifierTypes: VariableTypes = new Map();

    public run(tree: FunctionDeclaration,
               signature: FunctionSignature,
               signatures: FunctionSignatures): [ExpressionTypes, VariableTypes] {

        this.signatures = signatures;
        this.initializeParameterTypes(tree, signature);

        this.visit(tree.body);

        return [this.expressionTypes, this.identifierTypes];
    }

    protected visitBinaryExpression(node: BinaryExpression): void {
        super.visitBinaryExpression(node);

        const operator = node.operator;
        let type;

        if (['+', '-', '/', '%', '*'].includes(operator)) {
            const leftType = this.getTypeOfExpression(node.left);
            const rightType = this.getTypeOfExpression(node.right);

            type = getCommonNumberType(leftType, rightType);
        } else if (['<', '<=', '==', '!=', '>=', '>'].includes(operator)) {
            type = WebAssemblyType.BOOLEAN;
        } else {
            throw new Error(`Unknown operator ${operator}`);
        }

        this.expressionTypes.set(node, type);
    }

    protected visitUnaryExpression(node: UnaryExpression): void {
        super.visitUnaryExpression(node);

        const operator = node.operator;
        let type;

        if (operator === '!') {
            type = WebAssemblyType.BOOLEAN;
        } else if (['+', '-'].includes(operator)) {
            type = this.getTypeOfExpression(node.argument);
        } else {
            throw new Error(`Unknown operator ${operator}`);
        }

        this.expressionTypes.set(node, type);
    }

    protected visitUpdateExpression(node: UpdateExpression) {
        super.visitUpdateExpression(node);
        this.expressionTypes.set(node, this.getTypeOfExpression(node.argument));
    }

    protected visitNumericLiteral(node: NumericLiteral) {
        super.visitNumericLiteral(node);

        this.expressionTypes.set(node, getNumberType(node.value));
    }

    protected visitBooleanLiteral(node: BooleanLiteral) {
        super.visitBooleanLiteral(node);

        this.expressionTypes.set(node, WebAssemblyType.BOOLEAN);
    }

    protected visitLogicalExpression(node: LogicalExpression): void {
        super.visitLogicalExpression(node);

        this.expressionTypes.set(node, WebAssemblyType.BOOLEAN);
    }

    protected visitIdentifier(node: Identifier) {
        super.visitIdentifier(node);

        this.expressionTypes.set(node, this.getTypeOfIdentifier(node));
    }

    protected visitCallExpression(node: CallExpression): void {
        for (const argument of node.arguments) {
            super.visit(argument);
        }

        const callee = node.callee;

        if (isIdentifier(callee)) {
            const name = callee.name;
            const signature = this.signatures.get(name);

            if (signature === undefined) {
                throw new Error(`Couldn\'t find signature of function ${name}`);
            }

            this.expressionTypes.set(node, signature.returnType);
        }
    }

    protected visitMemberExpression(node: MemberExpression): void {
        super.visit(node.object);

        let type;

        if (node.computed) {
            super.visit(node.property);

            const arrayType = this.getTypeOfExpression(node.object);

            switch (arrayType) {
                case WebAssemblyType.INT_32_ARRAY:
                    type = WebAssemblyType.INT_32;
                    break;
                case WebAssemblyType.FLOAT_64_ARRAY:
                    type = WebAssemblyType.FLOAT_64;
                    break;
                default:
                    throw new Error(`Unknown array type ${WebAssemblyType[arrayType]}`);
            }
        } else if (isIdentifier(node.property) && node.property.name === 'length') {
            type = WebAssemblyType.INT_32;
        } else {
            throw new Error('Invalid member expression');
        }

        this.expressionTypes.set(node, type);
    }

    protected visitVariableDeclarator(node: VariableDeclarator): void {
        super.visitVariableDeclarator(node);

        if (node.init !== null && isIdentifier(node.id)) {
            const rightSideType = this.getTypeOfExpression(node.init);

            this.expressionTypes.set(node.id, rightSideType);
            this.updateIdentifierType(node.id, rightSideType);
        }
    }

    protected visitAssignmentExpression(node: AssignmentExpression): void {
        super.visit(node.right);

        if (isIdentifier(node.left)) {
            this.assignToIdentifier(node);
        } else if (isMemberExpression(node.left)) {
            super.visit(node.left);

            if (isIdentifier(node.left.object)) {
                const rightType = this.getTypeOfExpression(node.right);
                const leftType = this.getTypeOfExpression(node.left);

                if (leftType === WebAssemblyType.INT_32_ARRAY && rightType === WebAssemblyType.FLOAT_64) {
                    throw new Error('Unable to assign double value to int array element');
                }
            }
        }
    }

    private assignToIdentifier(node: AssignmentExpression) {
        const {left: identifier, right: expression, operator} = node;

        if (isIdentifier(identifier)) {
            let rightSideType = this.getTypeOfExpression(expression);

            if (operator === '=') {
                this.updateIdentifierType(identifier, rightSideType);
            } else {
                rightSideType = getCommonNumberType(this.getTypeOfIdentifier(identifier), rightSideType);
            }

            this.checkIfTypeIsUnchanged(identifier, rightSideType);
            this.expressionTypes.set(identifier, rightSideType);
        }
    }

    private getTypeOfIdentifier(identifier: Identifier) {
        for (const [key, value] of this.expressionTypes) {
            if (isIdentifier(key) && key.name === identifier.name) {
                return value;
            }
        }

        throw new Error(`Unknown type for identifier ${identifier.name}`);
    }

    private initializeParameterTypes(tree: FunctionDeclaration, signature: FunctionSignature) {
        tree.params.forEach((parameter, index) => {
            if (!isIdentifier(parameter)) {
                throw new Error('Parameter is not of type identifier');
            }

            const type = signature.parameterTypes[index];

            this.updateIdentifierType(parameter, type);
            this.expressionTypes.set(parameter, type);
        });
    }

    private checkIfTypeIsUnchanged(identifier: Identifier, type: WebAssemblyType) {
        const name = identifier.name;

        if (this.identifierTypes.has(name)) {
            const currentValue = this.identifierTypes.get(name);

            if (currentValue !== type) {
                if (currentValue === undefined) {
                    throw new Error(`Tried to change the type of ${name}` +
                    `from undefined to ${WebAssemblyType[type]}`);
                } else {
                    throw new Error(`Tried to change the type of ${name}` +
                    `from ${WebAssemblyType[currentValue]} to ${WebAssemblyType[type]}`);
                }
            }
        }
    }

    private checkIfTypeOfExpressionIsUnchanged(expression: Expression, type: WebAssemblyType) {
        if (this.expressionTypes.has(expression)) {
            const currentValue = this.expressionTypes.get(expression);

            if (currentValue !== type) {
                if (currentValue === undefined) {
                    throw new Error(`Tried to change the type of an expression`
                    + `from undefined to ${WebAssemblyType[type]}`);
                } else {
                    throw new Error(`Tried to change the type of an expression`
                    + `from ${WebAssemblyType[currentValue]} to ${WebAssemblyType[type]}`);
                }
            }
        }
    }

    private updateIdentifierType(identifier: Identifier, type: WebAssemblyType) {
        this.checkIfTypeIsUnchanged(identifier, type);

        const name = identifier.name;

        if (!this.identifierTypes.has(name)) {
            this.identifierTypes.set(name, type);
        }
    }

    private getTypeOfExpression(expression: Expression) {
        const type = this.expressionTypes.get(expression);

        if (type === undefined) {
            throw new Error(`The type of expression ${expression.type} could not be infered`);
        }

        return type;
    }
}

export {TypeInferenceVisitor, ExpressionTypes, VariableTypes};
