const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HotModuleReplacementPlugin = require('webpack/lib/HotModuleReplacementPlugin');
module.exports = {
    mode:'development',
    devtool:false,
    entry:'./src/index.js',
    output:{
        filename:'[name].[hash].js',
        path:path.resolve(__dirname,'dist'),
        hotUpdateGlobal:'webpackHotUpdate'
    },
    devServer:{
        hot:true,//支持热更新
        port:8080,
        contentBase:path.resolve(__dirname,'static')
    },
    plugins:[
        new HtmlWebpackPlugin({
            template:'./public/index.html'
        }),
        new HotModuleReplacementPlugin()//此处可写可不写，因为如果devServer.hot==true的话，webpack会自动帮你添加此插件
    ]

}