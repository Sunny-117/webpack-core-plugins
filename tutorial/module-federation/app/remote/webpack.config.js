let path = require("path");
let webpack = require("webpack");
let HtmlWebpackPlugin = require("html-webpack-plugin");
let ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
module.exports = {
    mode: "development",
    entry: "./src/index.js",
    devtool:false,
    output: {
        publicPath: "http://localhost:3000/",
    },
    devServer: {
        port: 3000
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ["@babel/preset-react"]
                    },
                },
                exclude: /node_modules/,
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template:'./public/index.html'
        }),
        //如果这个组件想被别人引用，引用路径 ${name}/${expose}  remote/NewsList
        new ModuleFederationPlugin({
            name:'remote',
            filename:'remoteEntry.js',
            exposes:{
                './NewsList':'./src/NewsList'
            },
             shared:{
                react:{singleton:true},
                'react-dom':{singleton:true}
            } 
        })
    ]
}