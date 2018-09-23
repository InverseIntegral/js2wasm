const path = require('path');

module.exports = {
    mode: "development",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'awesome-typescript-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ]
    },
    entry: {
        binaryen: './src/examples/add/binaryen/example.ts',
        browser: './src/examples/add/browser/example.ts'
    },
    output: {
        filename: '[name]/bundle.js',
        path: path.resolve(__dirname, 'dist/examples')
    },
    target: "node" // because of require in binaryen
};
