const { resolve, join, basename } = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FileManagerPlugin = require('filemanager-webpack-plugin');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
/* let devConfig={}
let prodConfig={};
let config = process.env.NODE_ENV==='production'?prodConfig:devConfig; */
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
//UglifyJsPlugin 已经废弃，不再使用
let pagesRoot = resolve(__dirname, 'src', 'pages');
let pages = fs.readdirSync(pagesRoot);
let entry = pages.reduce((entry, fileName) => {
    let entryName = basename(fileName, '.js');
    entry[entryName] = join(pagesRoot, fileName);
    return entry;
}, {});
module.exports = (env) => ({
    // mode 当前的运行模式  开发环境  生产环境 不指定环境
    mode: process.env.NODE_ENV,
    devtool: 'hidden-source-map',
    //对于入口来说，name就是entry的key,字符串就是main
    //对于非入口来说 
    //import('./src/title.js') src_title_js
    //代码分割 vendor common自己指定的
    entry: './src/index.js',
    optimization: {
        minimize: process.env.NODE_ENV === 'production',//如果是生产环境才开启压缩
        minimizer: (env && env.production) ? [
            new TerserPlugin()//如果是生产环境才会配置js压缩器
        ] : []//否则不配置任何压缩器
    },
    output: {
        path: resolve(__dirname, 'dist'), // 输出文件夹的绝对路径
        //入口代码块的名称 main
        filename: '[name].[hash:10].js', // 输出的文件名
        //非入口代码块的名称配置项 
        //非入口代码块有两个来源1.代码分割 vendor common
        //懒加载  import方法加载模块
        chunkFilename: '[name].[hash:10].js',
        publicPath: '/'
    },
    devServer: {
        contentBase: resolve(__dirname, 'static'),
        compress: true, /// 是否启动压缩 gzip
        port: 9999, // 指定HTTP服务器的端口号
        open: true, // 自动打开浏览器
        //不是启动了一个新的服务器，而是给原来老的9999服务器添加了一个路由
        before(app) {
            //webpack-dev-sever就是一个express服务器 express();
            app.get('/api/users', (req, res) => {//可以在这里定义路由
                res.json([{ id: 1, name: 'sunny' }]);
            });
        },
        //create-react-app支持你把代理写在package.json
        // proxy: {
        //     '/api': {//http://localhost:9999 /users
        //         target: 'http://localhost:3000',
        //         pathRewrite: {
        //             "^/api": ""
        //         }
        //     }
        // }
    },
    watch: true,
    watchOptions: {//监听选项
        ignored: /node_modules/,//不监听哪些文件夹
        aggregateTimeout: 300,//监听到文件发生变化后延迟300毫秒才去重新编译
        poll: 1000//1秒问1000次，数字越大，越敏感，数字越小，越延迟
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
            {
                test: /\.css$/, use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [
                                    "postcss-preset-env"
                                ],
                            },
                        }
                    },
                    {
                        loader: 'px2rem-loader',
                        options: {
                            remUnit: 75
                        }
                    }]
            },
            { test: /\.less$/, use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'less-loader'] },
            { test: /\.scss$/, use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader'] },
            {
                test: /\.(jpg|png|gif|bmp)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        name: '[hash:10].[ext]',
                        esModule: false,
                        limit: 32 * 1024,
                        outputPath: 'images',//指定输出图片的目录images目录 
                        //加上/就是相对于根路径，不加/就是相对于当前的文件相对路径
                        //  /css/main.css /css/images/hash.png
                        publicPath: '/images'//访问图片的话也需要去images目录里找
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
        //webpack在打包之后会把所有的产出的资源放在一个assets对象上
        // minify: {//启动HTML压缩
        //     collapseWhitespace: true,
        //     removeComments: true
        // }
        // new HtmlWebpackPlugin({
        //      template: './src/index.html',
        //      filename:'page1.html', 
        //      chunks:['page1'],// 插入到html中什么js、css文件
        //      minify:{//启动HTML压缩
        //          collapseWhitespace:true,
        //          removeComments:true
        //      }
        //  }),
        //  new HtmlWebpackPlugin({
        //      template: './src/index.html',
        //      filename:'page2.html',
        //      chunks:['page2'],
        //      minify:{//启动HTML压缩
        //          collapseWhitespace:true,
        //          removeComments:true
        //      }
        //  }),
        //一个入口可能会对应多个代码块 代码分割
        //一个代码块可能会对应多个文件main main.js main.css
        //等到讲插件我们会手写这个插件
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: resolve(__dirname, 'src/documents'),
                    to: resolve(__dirname, 'dist/documents')
                }
            ]
        }),
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: ["**/*"] //glob文件匹配模式 *可以匹配任意字符，除了路径分隔, 符 **可以匹配任意字符，包括路径分隔符
        }),
        //把收集到的所有的CSS样式都写入到main.css,然后现把此资源插入到HTML里去
        new MiniCssExtractPlugin({
            filename: 'css/[name].css'
        }),
        (env && env.production) && new OptimizeCssAssetsWebpackPlugin()
    ].filter(Boolean),

});

