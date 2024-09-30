const { resolve } = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');
// --env
// cross-env NODE_ENV=production
module.exports = (env = {}) => {
    // 如果在执行命令的时候没有传--env ,那么此处的env就是undefined
    console.log(env);
    return ({
        // mode 当前的运行模式  开发环境  生产环境 不指定环境
        mode: 'development',
        devtool: 'hidden-source-map',
        entry: './src/index.js',
        output: {
            path: resolve(__dirname, 'dist'), // 输出文件夹的绝对路径
            filename: 'main.js', // 输出的文件名
            // 当你把打包后文件插入到index.html文件里的时候 src如何写的?publicPath+filename
            // /assets/js/main.js
            // 上线这后有可能指向CDN地址,上线后把你的静态文件放在哪个目录里,线上访问目录
            // 调试线上一些资源，这里会指向CDN地址
            // publicPath:'/cdn/'
        },
        // devServer会启动一个HTTP开发服务器，把一个文件夹作为静态根目录
        // 为了提高性能，使用的内存文件系统
        // 默认情况下devServer会读取打包后的路径
        // 其实静态文件根目录是可以有多个的,先看dist里面，没有的话寻找contentBase
        // 一般不配置devServer.publicPath，只配置output.publicPath即可
        devServer: {
            contentBase: resolve(__dirname, 'static'),
            // publicPath:'http://localhost:9999/assets/', 意味着可以通过http://localhost:9999/assets/来访问打包后的静态资源 index.html main.js
            // writeToDisk:true,//如果你指定此选项，也会把打包后的文件写入硬盘一份
            compress: true, /// 是否启动压缩 gzip
            port: 9999, // 指定HTTP服务器的端口号
            open: true, // 自动打开浏览器
        },
        // 如果我已经通过CDN外链引入的方式引入了一个lodash库并且挂载到了_变量上了
        externals: {
            lodash: '_',
        },
        module: {
            rules: [
                /* {
                        test: require.resolve('lodash'),
                        loader: 'expose-loader',
                        options: {
                            exposes: {
                                globalName: '_',
                                override: true,
                            },
                        },
                    }, */
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
                                    ["@babel/preset-env",
                                        // useBuiltIns: false 不对polyfill做操作，直接引入所有的polyfill 代价非常多非常大 建议按需加载
                                        /* {
                                                useBuiltIns: 'usage', // 按需加载polyfill
                                                // debug: true,
                                                corejs: { version: 3 }, // 指定corejs的版本号 2或者3 polyfill
                                                targets: { // 指定要兼容哪些浏览器
                                                    chrome: '60',
                                                },
                                            }, */
                                        // 更推荐使用www.polyfill.io/v3/polyfill.min.js
                                        // 自动根据浏览器版本下载polyfill文件
                                    ],
                                    "@babel/preset-react", // 可以转换JSX语法
                                ],
                                plugins: [
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
                            // 如果文件的体积小于limit，小于8K的话，就转成BASE64字符串内嵌到HTML中，否则 行为和file-loader
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
            // new HtmlWebpackExternalsPlugin({
            //     externals: [
            //         {
            //             module: 'lodash', // 模块名
            //             entry: "https://cdn.bootcdn.net/ajax/libs/lodash.js/4.17.20/lodash.js",
            //             global: '_', // 全局变量名
            //         },
            //     ],
            // }),
            // 定义全局变量的插件
            new webpack.DefinePlugin({
                // "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
                DEV: JSON.stringify(process.env.NODE_ENV==='development')
            }),
            // new webpack.ProvidePlugin({
            //     _: 'lodash', // 相当于 import _ from 'lodash'
            // }),
        ],
    });
};
