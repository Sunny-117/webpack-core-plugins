const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HotModuleReplacementPlugin = require('webpack/lib/HotModuleReplacementPlugin');
module.exports = {
    mode:'development',
    entry:[
        path.resolve('./webpack-dev-server/client/index.js'),
        path.resolve('./webpack/hot/dev-server.js'),
       './src/index.js'],
    devtool:false,
    output:{
        filename:'[name].js',
        //会成为默认的静态文件服务器
        path:path.resolve(__dirname,'dist'),
        hotUpdateGlobal:'webpackHotUpdate'
    },
    devServer:{
        //hot:true,//支持热更新
        port:9000,
        //除了打包后的资源外的额外的静态文件器
        contentBase:path.resolve(__dirname,'static')
    },
    plugins:[
        new HtmlWebpackPlugin({
            template:'./public/index.html'
        }),
        new HotModuleReplacementPlugin()//此处可写可不写，因为如果devServer.hot==true的话，webpack会自动帮你添加此插件
    ]

}