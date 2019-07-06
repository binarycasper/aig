const path = require("path");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    mode: 'production',
    entry: {
        app: './src/index.js'
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'app.bundle.js'
    },
    module: {
        rules: [
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
    plugins: [
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, './src/assets', '**', '*'),
                to: path.resolve(__dirname, 'build')
            }
        ]),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: './src/index.html',
            inject: 'head',
            chucks: ['vendor', 'app'],
            minify: {
                collapseWhitespace: true,
                removeComments: true,
                removeAttributeQuotes: true 
            }
        }),
        new webpack.DefinePlugin({
            'typeof CANVAS_RENDERER': JSON.stringify(true),
            'typeof WEBGL_RENDERER': JSON.stringify(true)
        }),
        new webpack.HashedModuleIdsPlugin(),
    ],
    optimization: {
        runtimeChunk: 'single',
        splitChunks: {
            chunks: 'all',
            minSize: 0,
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10
                },
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true
                }
            },
        },
    },
    devServer: {
        contentBase: path.resolve(__dirname, 'build'),
    },
};

    