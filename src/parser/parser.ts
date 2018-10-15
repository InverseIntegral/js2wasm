import {parse} from '@babel/parser';
import {File} from '@babel/types';

class Parser {

    public static parse(text: string): File {
        return parse(text);
    }

}

export default Parser;
