import {
    AssignmentExpression,
    FunctionDeclaration,
    isArrayExpression,
    isIdentifier,
    LVal,
    VariableDeclarator,
} from '@babel/types';
import Visitor from '../visitor';

type VariableMapping = Map<string, number>;

class DeclarationVisitor extends Visitor {

    private static memoryOffset: number = 0;

    private static registerArray(val: LVal, length: number, map: VariableMapping) {
        if (!isIdentifier(val)) {
            throw new Error('LValue is not an identifier');
        }

        // Skip one memory offset to store the size in it
        map.set(val.name, ++DeclarationVisitor.memoryOffset * 4);
        DeclarationVisitor.memoryOffset += length;
    }

    private index: number = 0;
    private parameters: VariableMapping = new Map();
    private variables: VariableMapping = new Map();
    private localArrayPointers: VariableMapping = new Map();

    public run(tree: FunctionDeclaration): [VariableMapping, VariableMapping, VariableMapping] {
        tree.params.forEach((node) => this.registerDeclaration(node, this.parameters));

        this.visit(tree.body);

        return [this.parameters, this.variables, this.localArrayPointers];
    }

    protected visitVariableDeclarator(node: VariableDeclarator) {
        if (node.init !== null && isArrayExpression(node.init)) {
            DeclarationVisitor.registerArray(node.id, node.init.elements.length, this.localArrayPointers);
        }

        this.registerDeclaration(node.id, this.variables);
    }

    protected visitAssignmentExpression(node: AssignmentExpression) {
        if (isArrayExpression(node.right)) {
            DeclarationVisitor.registerArray(node.left, node.right.elements.length, this.localArrayPointers);
        }
    }

    private registerDeclaration(val: LVal, map: VariableMapping) {
        if (isIdentifier(val)) {
            if (!map.has(val.name)) {
                map.set(val.name, this.index++);
            }
        } else {
            throw new Error('LValue is not an identifier');
        }
    }

}

export {VariableMapping, DeclarationVisitor};
