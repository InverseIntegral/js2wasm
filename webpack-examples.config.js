const path = require('path');

module.exports = {
    node: {
        fs: 'empty'
    },
    mode: 'development',
    entry: {
        binaryen_add_example: './src/examples/binaryen/example.js',
        browser_add_example: './src/examples/browser/example.js'
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist/examples')
    }
};
