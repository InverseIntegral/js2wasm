import {
    ArrayExpression,
    File,
    isFunctionDeclaration,
} from '@babel/types';
import Visitor from '../visitor';

class ArrayLiteralVisitor extends Visitor {

    private arrayLiteralMemorySize = 0;

    public run(file: File) {
        file.program.body.forEach((statement) => {
            if (isFunctionDeclaration(statement)) {
                this.visit(statement.body);
            }
        });

        return this.arrayLiteralMemorySize;
    }

    protected visitArrayExpression(node: ArrayExpression) {
        this.arrayLiteralMemorySize = node.elements.length + 1;
    }

}

export {ArrayLiteralVisitor};
