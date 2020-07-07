var path = require('path');
var webpack = require('webpack');


module.exports = {
    entry: ['babel-polyfill', './src/client.tsx'],
    mode: 'development',
    output: {path: __dirname + '/public/js/', filename: 'bundle.js'},
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
