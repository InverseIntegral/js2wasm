const path = require('path');

module.exports = {
    mode: 'development', // Otherwise the benchmark cases get optimized
    devtool: false, // removes eval from bundle
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
        extensions: [ '.ts', '.js' ]
    },
    entry: {
        benchmark: './src/benchmark/index.ts'
    },
    output: {
        filename: '[name]/bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    node: {
        fs: 'empty' // binaryen requires fs
    }
};
