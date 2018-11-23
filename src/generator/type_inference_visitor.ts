import {
    AssignmentExpression,
    BinaryExpression, BooleanLiteral, CallExpression,
    Expression,
    FunctionDeclaration,
    Identifier,
    isIdentifier,
    LogicalExpression, MemberExpression,
    NumericLiteral, UnaryExpression, VariableDeclarator,
} from '@babel/types';
import Visitor from '../visitor';
import {FunctionSignature, FunctionSignatures} from './generator';
import {WebAssemblyType} from './wasm_type';

class TypeInferenceVisitor extends Visitor {

    private signatures: FunctionSignatures;
    private expressionTypes = new Map<Expression, WebAssemblyType>();

    public run(tree: FunctionDeclaration,
               signature: FunctionSignature,
               signatures: FunctionSignatures) {

        this.signatures = signatures;
        this.initializeTypes(tree, signature);

        this.visit(tree.body);

        return this.expressionTypes;
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

        this.expressionTypes.set(node, WebAssemblyType.INT_32);
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
        }
    }

    private getTypeOfIdentifier(identifier: Identifier) {
        for (const [key, value] of this.expressionTypes) {
            if (isIdentifier(key) && key.name === identifier.name) {
                return value;
            }
        }
    }

    private initializeTypes(tree: FunctionDeclaration, signature: FunctionSignature) {
        tree.params.forEach((parameter, index) => {
            if (!isIdentifier(parameter)) {
                throw new Error('Parameter is not of type identifier');
            }

            this.expressionTypes.set(parameter, signature.parameterTypes[index]);
        });
    }
}

export {TypeInferenceVisitor};
