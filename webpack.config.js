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
    entry: './src/js2wasm.ts',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        library: 'js2wasm'
    },
    node: {
        fs: 'empty' // binaryen requires fs
    }
};
