import {parseExpression} from '@babel/parser';
import {FunctionExpression, isFunctionExpression} from '@babel/types';

class Parser {

    public static parse(text: string): FunctionExpression {
        const tree = parseExpression(text);

        if (!isFunctionExpression(tree)) {
            throw new Error('The provided string is not a function expression');
        }

        return tree;
    }

}

export default Parser;
