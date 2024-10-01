let path = require("path");
let HtmlWebpackPlugin = require("html-webpack-plugin");
//远程容器的配置，主要是向外部暴露模块
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
module.exports = {
    mode: "development",
    devtool:false,
    entry: "./src/index.js",
    output: {
        publicPath: "http://localhost:8080/"
    },
    experiments:{
        topLevelAwait:true
    },
    devServer: {
        port: 8080
    },
    plugins: [
        new HtmlWebpackPlugin({
            template:'./public/index.html'
        }),
        new ModuleFederationPlugin({
            filename:'remoteEntry.js',
            name:'teamb',
            exposes:{
                './Dropdown':"./src/Dropdown.js",//teamb/Dropdown
                './Button':"./src/Button.js",//teamb/Button
            },
            shared:['is-array']
        })
    ]
}