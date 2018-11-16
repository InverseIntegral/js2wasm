import {
    FunctionDeclaration,
    isArrayExpression,
    isIdentifier,
    LVal,
    VariableDeclarator,
} from '@babel/types';
import Visitor from '../visitor';

type VariableMapping = Map<string, number>;

class DeclarationVisitor extends Visitor {

    private index: number = 0;
    private memoryOffset: number = 0;
    private parameters: VariableMapping = new Map();
    private variables: VariableMapping = new Map();

    public run(tree: FunctionDeclaration): [VariableMapping, VariableMapping] {
        tree.params.forEach((node) => this.registerDeclaration(node, this.parameters));

        this.visit(tree.body);

        return [this.parameters, this.variables];
    }

    protected visitVariableDeclarator(node: VariableDeclarator) {
        if (node.init !== null && isArrayExpression(node.init)) {
            this.registerArrayDeclaration(node.id, node.init.elements.length, this.variables);
        } else {
            this.registerDeclaration(node.id, this.variables);
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

    private registerArrayDeclaration(val: LVal, length: number, map: VariableMapping) {
        if (!isIdentifier(val)) {
            throw new Error('LValue is not an identifier');
        }

        // Skip one memory offset to store the size in it
        map.set(val.name, ++this.memoryOffset * 4);
        this.memoryOffset += length;
    }
}

export {VariableMapping, DeclarationVisitor};
