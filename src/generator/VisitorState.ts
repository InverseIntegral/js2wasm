import {Expression, Statement} from 'binaryen';

class VisitorState {

    public expressions: Expression[] = [];
    public statements: Statement[] = [];
    public body: Statement;

}

export default VisitorState;
