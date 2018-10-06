import {IfStatement} from '@babel/types';
import {Expression, Statement} from 'binaryen';

class VisitorState {

    public expressionStack: Expression[] = [];
    public statements: Statement[] = [];
    public body: Statement;
    public branches: Map<IfStatement, [Statement, (Statement | undefined)]> = new Map();

}

export default VisitorState;
