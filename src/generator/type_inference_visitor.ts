import {
    AssignmentExpression,
    BinaryExpression,
    BooleanLiteral,
    CallExpression,
    Expression,
    FunctionDeclaration,
    Identifier,
    isIdentifier, isMemberExpression,
    LogicalExpression,
    MemberExpression,
    NumericLiteral,
    UnaryExpression,
    VariableDeclarator,
} from '@babel/types';
import Visitor from '../visitor';
import {FunctionSignature, FunctionSignatures} from './generator';
import {getNumberType, WebAssemblyType} from './wasm_type';

type ExpressionTypes = Map<Expression, WebAssemblyType>;
type VariableTypes = Map<string, WebAssemblyType>;

class TypeInferenceVisitor extends Visitor {

    private signatures: FunctionSignatures;
    private expressionTypes: ExpressionTypes = new Map();
    private variableTypes: VariableTypes = new Map();

    public run(tree: FunctionDeclaration,
               signature: FunctionSignature,
               signatures: FunctionSignatures): [ExpressionTypes, VariableTypes] {

        this.signatures = signatures;
        this.initializeParameterTypes(tree, signature);

        this.visit(tree.body);

        return [this.expressionTypes, this.variableTypes];
    }

    protected visitBinaryExpression(node: BinaryExpression): void {
        super.visitBinaryExpression(node);

        const operator = node.operator;
        let type;

        if (['+', '-', '/', '%', '*'].includes(operator)) {
            type = WebAssemblyType.INT_32;
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
            type = WebAssemblyType.INT_32;
        } else {
            throw new Error(`Unknown operator ${operator}`);
        }

        this.expressionTypes.set(node, type);
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

        const identifierType = this.getTypeOfIdentifier(node);

        if (identifierType === undefined) {
            throw new Error(`Unknown type for identifier ${node.name}`);
        }

        this.expressionTypes.set(node, identifierType);
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
            type = WebAssemblyType.INT_32_ARRAY;
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
            const rightSideType = this.expressionTypes.get(node.init);

            if (rightSideType === undefined) {
                throw new Error(`Unknown type for right side of assignment to ${node.id.name}`);
            }

            this.expressionTypes.set(node.id, rightSideType);
            this.updateVariableTypes(node.id, rightSideType);
        }
    }

    protected visitAssignmentExpression(node: AssignmentExpression): void {
        super.visit(node.right);

        if (isIdentifier(node.left)) {
            const rightSideType = this.expressionTypes.get(node.right);

            if (rightSideType === undefined) {
                throw new Error(`Unknown type for right side of assignment to ${node.left.name}`);
            }

            this.expressionTypes.set(node.left, rightSideType);
            this.updateVariableTypes(node.left, rightSideType);
        } else if (isMemberExpression(node.left)) {
            super.visit(node.left);

            const rightSideType = this.expressionTypes.get(node.right);

            if (rightSideType === undefined) {
                if (isIdentifier(node.left.object)) {
                    throw new Error(`Unknown type for right side of assignment to ${node.left.object.name}`);
                }
            } else {
                this.expressionTypes.set(node.left, rightSideType);
            }
        }
    }

    private getTypeOfIdentifier(identifier: Identifier) {
        for (const [key, value] of this.expressionTypes) {
            if (isIdentifier(key) && key.name === identifier.name) {
                return value;
            }
        }
    }

    private initializeParameterTypes(tree: FunctionDeclaration, signature: FunctionSignature) {
        tree.params.forEach((parameter, index) => {
            if (!isIdentifier(parameter)) {
                throw new Error('Parameter is not of type identifier');
            }

            this.expressionTypes.set(parameter, signature.parameterTypes[index]);
        });
    }

    private updateVariableTypes(identifier: Identifier, rightSideType: WebAssemblyType) {
        const currentValue = this.variableTypes.get(identifier.name);

        if (currentValue !== undefined && currentValue !== rightSideType) {
            throw new Error(`Tried to change the value type of ${identifier.name}
                from ${currentValue} to ${rightSideType}`);
        }

        this.variableTypes.set(identifier.name, rightSideType);
    }
}

export {TypeInferenceVisitor, ExpressionTypes, VariableTypes};
