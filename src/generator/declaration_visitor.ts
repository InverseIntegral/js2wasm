import {FunctionExpression, isIdentifier, LVal, VariableDeclarator} from '@babel/types';
import Visitor from '../visitor';
import {Mapping} from './generator';

class DeclarationVisitor extends Visitor {

    private index: number = 0;
    private parameters: Mapping = new Map();
    private variables: Mapping = new Map();

    public run(tree: FunctionExpression): [Mapping, Mapping] {
        tree.params.forEach((node) => this.registerDeclaration(node, this.parameters));

        this.visit(tree.body);

        return [this.parameters, this.variables];
    }

    protected visitVariableDeclarator(node: VariableDeclarator) {
        this.registerDeclaration(node.id, this.variables);
    }

    private registerDeclaration(val: LVal, map: Mapping) {
        if (isIdentifier(val)) {
            map.set(val.name, this.index++);
        } else {
            throw new Error('LValue is not an identifier');
        }
    }

}

export default DeclarationVisitor;
