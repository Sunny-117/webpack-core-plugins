let path = require("path");
let webpack = require("webpack");
let HtmlWebpackPlugin = require("html-webpack-plugin");
let ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
module.exports = {
    mode: "development",
    entry: "./src/index.js",
    output: {
        publicPath: "http://localhost:8000/",
    },
    devServer: {
        port: 8000
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
        new ModuleFederationPlugin({
            name:'host',
            filename:'remoteEntry.js',
            remotes:{
                remote:'remote@http://localhost:3000/remoteEntry.js'
            },
           shared:{
                react:{singleton:true},
                'react-dom':{singleton:true}
            }
        })
    ]
}