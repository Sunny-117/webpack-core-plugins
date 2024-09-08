let path = require("path");
let HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
module.exports = {
    mode: "development",
    devtool:false,
    entry: "./src/index.js",
    output: {
        publicPath: "http://localhost:8081/"
    },
    experiments:{
        topLevelAwait:true
    },
    devServer: {
        port: 8081
    },
    plugins: [
        new HtmlWebpackPlugin({
            template:'./public/index.html'
        }),
        new ModuleFederationPlugin({
            filename:'remoteEntry.js',
            name:'teama',
            remotes:{//teambVar全局变量名
                teamb:"teamb@http://localhost:8080/remoteEntry.js"
            },
            shared:['is-array']
        })
    ]
}