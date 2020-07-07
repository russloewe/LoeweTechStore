var path = require('path');
var webpack = require('webpack');


module.exports = {
    entry: [  './src/store/store.tsx'],
    mode: 'development',
    output: {path: __dirname + '/public/js/', filename: 'store.js'},
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
