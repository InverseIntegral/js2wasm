import {Expression, Statement} from 'binaryen';

class VisitorState {

    public expressionStack: Expression[] = [];
    public statements: Statement[] = [];
    public body: Statement;

}

export default VisitorState;
