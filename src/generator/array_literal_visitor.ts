import {
    AssignmentExpression,
    FunctionDeclaration,
    isArrayExpression,
    isIdentifier,
    LVal,
    VariableDeclarator,
} from '@babel/types';
import Visitor from '../visitor';
import {VariableMapping} from './declaration_visitor';

class ArrayLiteralVisitor extends Visitor {

    private memoryOffset = 0;
    private localArrayPointers: VariableMapping;

    public run(tree: FunctionDeclaration): VariableMapping {
        this.localArrayPointers = new Map();
        this.visit(tree.body);
        return this.localArrayPointers;
    }

    protected visitVariableDeclarator(node: VariableDeclarator) {
        if (node.init !== null && isArrayExpression(node.init)) {
            this.registerArray(node.id, node.init.elements.length);
        }
    }

    protected visitAssignmentExpression(node: AssignmentExpression) {
        if (isArrayExpression(node.right)) {
            this.registerArray(node.left, node.right.elements.length);
        }
    }

    private registerArray(val: LVal, length: number) {
        if (!isIdentifier(val)) {
            throw new Error('LValue is not an identifier');
        }

        // Skip one memory offset to store the size in it
        this.localArrayPointers.set(val.name, ++this.memoryOffset * 4);
        this.memoryOffset += length;
    }

}

export {ArrayLiteralVisitor};
