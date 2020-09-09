const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const path = require('path');

module.exports = {
    mode: 'development',

    // Enable sourcemaps for debugging webpack's output.
    devtool: 'source-map',

    entry: './src/index.tsx',

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: ['.ts', '.tsx', '.js', '.json']
    },

    devServer: {
        port: 3000,
        compress: true,
        historyApiFallback: true
    },

    plugins: [
        new ExtractTextPlugin({
            filename: 'styles.css',
            allChunks: true
        }),
        new HtmlWebpackPlugin({
            title: 'Origin',
            template: './src/index.ejs',
            meta: {
                viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no'
            }
        }),
        new CopyWebpackPlugin([{ from: 'env-config.js', to: 'env-config.js' }]),
        new ForkTsCheckerWebpackPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.(scss|css)$/,
                use: [
                    {
                        loader: 'style-loader' // creates style nodes from JS strings
                    },
                    {
                        loader: 'css-loader' // translates CSS into CommonJS
                    },
                    {
                        loader: 'resolve-url-loader',
                    },
                    {
                        loader: 'sass-loader' // compiles Sass to CSS
                    }
                ]
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192
                        }
                    }
                ]
            },
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            { enforce: 'pre', test: /\.js\.map$/, loader: 'source-map-loader' },
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                options: {
                    configFile: '../tsconfig.json',
                    projectReferences: true,
                    transpileOnly: true
                }
            }
        ]
    },

    node: {
        fs: 'empty'
    },

    externals: [
        {
            xmlhttprequest: '{XMLHttpRequest:XMLHttpRequest}'
        }
    ]
};
