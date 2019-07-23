const merge = require('webpack-merge');
const common = require('./webpack.common');
const path = require("path");

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.(jpe?g|png)$/i,
                loader: 'file-loader',
            },
            {
                enforce: "pre",
                test: /\.js$/,
                exclude: /node_modules/,
                include: path.resolve(__dirname, 'src/'),
                loader: "eslint-loader",
                options: {
                    fix: true
                }
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                include: path.resolve(__dirname, 'src/'),
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    },
    devServer: {
        contentBase: path.resolve(__dirname, 'build/src'),
    }
}); 