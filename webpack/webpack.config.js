const {
    CleanWebpackPlugin
} = require("clean-webpack-plugin")
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { SkeletonPlugin } = require('./packages/skeleton');
const { resolve } = require("path");
module.exports = {
    mode: "development",
    devtool: "source-map",
    output: {
        filename: "scripts/[name].[chunkhash:5].js",
        publicPath: "/"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ["@babel/preset-env", "@babel/preset-react"]
                        },
                    }
                ],
                exclude: /node_modules/
            }
            , {
                test: /\.(png)|(gif)|(jpg)$/,
                use: [{
                    loader: "file-loader",
                    options: {
                        name: "imgs/[name].[hash:5].[ext]"
                    }
                }]
            }]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: "./public/index.html",
            filename: "html/index.html"
        }),
        new SkeletonPlugin({
            //我们要启动一个静态文件服务器，去显示dist目录里的页面。
            staticDir: resolve(__dirname, 'dist'),
            port: 8000,
            device: 'iPhone 6',
            button: {
                color: '#111'
            },
            image: {
                color: '#111'
            }
        })
    ],
    devServer: {
        open: true,
        openPage: "html/index.html",
    },
    stats: {
        modules: false,
        colors: true
    }
}