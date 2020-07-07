var path = require('path');
var webpack = require('webpack');
var nodeExternals = require('webpack-node-externals');

module.exports = {
    entry:  './build/bin/www.js',
    mode: 'production',
    target: 'node',
     node: {
        global: false,
        __filename: false,
        __dirname: false,
    },
     externals: [nodeExternals()],
    output: {path: __dirname + '/', filename: 'server-bundle.js'},
     module: {
        rules: [
            {
                test: /\.(js|jsx|tsx|ts)$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
            }
        ],
    },
    resolve: {
        // Allow require('./blah') to require blah.jsx
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    };
