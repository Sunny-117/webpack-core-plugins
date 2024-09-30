const { resolve ,join,basename} = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FileManagerPlugin = require('filemanager-webpack-plugin');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
/* let devConfig={}
let prodConfig={};
let config = process.env.NODE_ENV==='production'?prodConfig:devConfig; */
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const dotenv = require('dotenv');
require('dotenv').config({
    path:resolve(__dirname,'.qa.env')
});
console.log('process.env.NODE_ENV',process.env.NODE_ENV);
module.exports = (env)=>({
    // mode 当前的运行模式  开发环境  生产环境 不指定环境
    mode: process.env.NODE_ENV,
    devtool: 'hidden-source-map',
    //对于入口来说，name就是entry的key,字符串就是main
    //对于非入口来说 
      //import('./src/title.js') src_title_js
      //代码分割 vendor common自己指定的
    entry:{
        main:'./src/index.js',
        vendor:['jquery','lodash']
    },
    /* optimization:{
        splitChunks:{
            chunks:'all'//讲完webpack原理之后会可以讲这个
            vendor,
            commons
        }
    }, */
    output: {
        //Output中filename和chunkFilename区别是啥 
        path: resolve(__dirname, 'dist'), // 输出文件夹的绝对路径
        //入口模块
        filename: '[name].[chunkhash:5].js', // 输出的文件名
        //非入口模块 import splitChunks
        chunkFilename:'[name].[chunkhash:5].js',
        publicPath:'/'
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
                loader: 'eslint-loader', // 先进行代码校验，然后再编译代码
                enforce: 'pre', // 强制指定顺序 pre 之前 pre normal inline post
                options: { fix: true }, // 启动自动修复
                include: resolve(__dirname, 'src'), // 只检查src目录里面的文件 白名单
                // exclude:/node_modules/ //不需要检查node_modules里面的代码 黑名单
            },
            {
                test: /\.jsx?$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                ["@babel/preset-env"],
                            ],
                            plugins: [
                                ["@babel/plugin-proposal-decorators", { legacy: true }],
                                ["@babel/plugin-proposal-class-properties", { loose: true }],
                            ],
                        },
                    },
                ],
            },
            //用MiniCssExtractPlugin.loader替换掉style-loader
            //把所有的css样式先收集起来
            { test: /\.css$/, use: [
                MiniCssExtractPlugin.loader, 
                'css-loader',
                {
                    loader:'postcss-loader',
                    options:{
                        postcssOptions: {
                            plugins: [
                                "postcss-preset-env"
                            ],
                        },
                    }
            },
            {
                loader:'px2rem-loader',
                options:{
                    remUnit:75
                }
            }] },
            { test: /\.less$/, use: [MiniCssExtractPlugin.loader, 'css-loader','postcss-loader', 'less-loader'] },
            { test: /\.scss$/, use: [MiniCssExtractPlugin.loader, 'css-loader','postcss-loader', 'sass-loader'] },
            {
                test: /\.(jpg|png|gif|bmp)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        name: '[hash:10].[ext]',
                        esModule: false,
                        limit: 32 * 1024,
                        outputPath:'images',//指定输出图片的目录images目录 
                        //加上/就是相对于根路径，不加/就是相对于当前的文件相对路径
                        //  /css/main.css /css/images/hash.png
                        publicPath:'/images'//访问图片的话也需要去images目录里找
                    },
                }],
            },
            { test: /\.html$/, use: ['html-loader'] },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename:'index.html'
        }),
        //把收集到的所有的CSS样式都写入到main.css,然后现把此资源插入到HTML里去
        new MiniCssExtractPlugin({
            //只要CSS内容不变，contenthash就不会变
            filename:'[name].[contenthash:5].css'
        }),
        false
    ].filter(Boolean),
   
});
//glob文件匹配模式 *可以匹配任意字符，除了路径分隔, 符 **可以匹配任意字符，包括路径分隔符
