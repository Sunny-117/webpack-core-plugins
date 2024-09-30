const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FileManagerPlugin = require('filemanager-webpack-plugin');
const webpack = require('webpack');

let devConfig = {}
let prodConfig = {};
let config = process.env.NODE_ENV === 'production' ? prodConfig : devConfig;
module.exports = {
    mode: 'development',
    entry: './src/index.js',
    devtool: 'hidden-source-map',
    output: {
        path: resolve(__dirname, 'dist'), // 输出文件夹的绝对路径
        filename: 'main.js', // 输出的文件名
    },
    devServer: {
        contentBase: resolve(__dirname, 'static'),
        compress: true, /// 是否启动压缩 gzip
        port: 9999, // 指定HTTP服务器的端口号
        open: true, // 自动打开浏览器
    },
    externals: {
        lodash: '_',
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                ["@babel/preset-env",
                                    {
                                        // polyfill污染全局变量，可以用babel-runtime解决（需要手动引入）
                                        // 不需要手动引入：babel-plugin-transform-runtime
                                        useBuiltIns: 'usage',
                                        corejs: { version: 3 },
                                        targets: ">0.25%"
                                    },
                                ]
                            ],
                            plugins: [
                                [
                                     '@babel/plugin-transform-runtime',
                                     {
                                         corejs:3,
                                         helpers:true, // 是否需要提取类继承的帮助方法
                                         regenerator:true // 生成器
                                     }
                                 ],
                                 ["@babel/plugin-proposal-decorators", { legacy: true }],
                                 ["@babel/plugin-proposal-class-properties", { loose: true }],
                             ],
                        },
                    },
                ],
            },
            { test: /\.txt$/, use: 'raw-loader' },
            { test: /\.css$/, use: ['style-loader', 'css-loader'] },
            { test: /\.less$/, use: ['style-loader', 'css-loader', 'less-loader'] },
            { test: /\.scss$/, use: ['style-loader', 'css-loader', 'sass-loader'] },
            {
                test: /\.(jpg|png|gif|bmp)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        name: '[hash:10].[ext]',
                        esModule: false,
                        limit: 32 * 1024,
                    },
                }],
            },
            { test: /\.html$/, use: ['html-loader'] },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
        }),
        // sourceMap生成文件目录移动。测试环境没有map文件
        new webpack.SourceMapDevToolPlugin({
            filename:'[file].map',//定义生成的 source map 的名称 main.js.map
            append:"\n//# sourceMappingURL=http://localhost:9999/[url]"
        }),
        new FileManagerPlugin({
            events:{
                onEnd:{
                    copy:[
                        {
                            source:'./dist/**/*.map',
                            destination:'./sourcemap'
                        }
                    ],
                    delete:['./dist/*.map']
                }
            }
        })
    ],
};
