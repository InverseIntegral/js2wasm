import {Expression, Statement} from 'binaryen';

class VisitingState {

    public expressions: Expression[] = [];
    public statements: Statement[] = [];
    public body: Statement;

}

export default VisitingState;
