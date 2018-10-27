import {
    FunctionDeclaration,
    MemberExpression,
} from '@babel/types';
import Visitor from '../visitor';

class ContainsMemoryDependentElementVisitor extends Visitor {

    private contains: boolean = false;

    public run(tree: FunctionDeclaration) {
        this.visit(tree.body);

        return this.contains;
    }

    protected visitMemberExpression(node: MemberExpression) {
        this.contains = true;
    }

}

export {ContainsMemoryDependentElementVisitor};
