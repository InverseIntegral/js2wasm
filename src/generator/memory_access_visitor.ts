import {FunctionDeclaration, MemberExpression} from '@babel/types';
import Visitor from '../visitor';

class MemoryAccessVisitor extends Visitor {

    private isMemoryDependent: boolean = false;

    public run(tree: FunctionDeclaration) {
        this.visit(tree.body);

        return this.isMemoryDependent;
    }

    protected visitMemberExpression(node: MemberExpression) {
        this.isMemoryDependent = true;
    }

}

export {MemoryAccessVisitor};
