const path = require("path");
let DonePlugin = require('./DonePlugin');
let AssetsPlugin = require('./AssetsPlugin');
let ZipPlugin = require('./ZipPlugin');
let HtmlWebpackPlugin = require('html-webpack-plugin');
let AutoExternalPlugin = require('./AutoExternalPlugin');
let HashPlugin = require('./HashPlugin');
module.exports = {
  mode: "development",
  devtool: false,
  entry: "./src/index.js",
  output: {
    path: path.resolve("dist"),
    filename: "[name].js",
    chunkFilename: "[hash].[chunkHash].[contentHash].js",
  },
  //配置外部模块
  /*  externals:{
    //key jquery是要require或import 的模块名,值 jQuery是一个全局变量名
    'jquery':'$'
  }, */
  module: {
    rules: []
  },
  //webpack插件
  plugins: [
    /*  new HtmlWebpackPlugin({
       template:'./src/index.html'
     }), */
    /*  new AutoExternalPlugin({
       jquery:{
         expose:'jQuery',// window.$=window.jQuery
         url:'https://cdn.bootcss.com/jquery/3.1.0/jquery.js'
       },
       lodash:{
        expose:'_',// window.$=window.jQuery
        url:'https://cdn.bootcss.com/jquery/3.1.0/lodash.js'
      }
     }), */
    /*  new DonePlugin({
       message:'编译完成'
     }),
     new AssetsPlugin({
       filename:'assets.zip'
     }),
     new ZipPlugin({
       filename:'assets.zip'
     }) */
    new HashPlugin()
  ]
};