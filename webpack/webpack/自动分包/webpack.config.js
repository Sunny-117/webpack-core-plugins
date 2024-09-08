/*
 * @Author: 付志强 zhiqiangfu6@gmail.com
 * @Date: 2022-11-09 10:04:05
 * @LastEditors: 付志强 zhiqiangfu6@gmail.com
 * @LastEditTime: 2022-11-10 14:30:12
 * @FilePath: /webpack_learn/5.性能优化/自动分包/webpack.config.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%A
 */
const {
  CleanWebpackPlugin
} = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = {
  mode: "production", // 生产环境才需要分包
  entry: {
    page1: "./src/page1",
    page2: "./src/page2"
  },
  output: {
    filename: "[name].[hash:5].js"
  },
  optimization: {
    splitChunks: {
      //分包配置
      chunks: "all",
      // maxSize: 60000
      // automaticNameDelimiter: ".",分隔符
      // minChunks: 1,最小chunk引用数
      // minSize: 0
      cacheGroups: {
        styles: {
          minSize: 0,
          test: /\.css$/,
          minChunks: 2
        }
      }
    }
  },
  module: {
    rules: [{
      test: /\.css$/,
      use: [MiniCssExtractPlugin.loader, "css-loader"]
    }]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: "[name].[hash:5].css",
      chunkFilename: "common.[hash:5].css" //单独分离出去的文件命名
    }),
    new HtmlWebpackPlugin({ // 多页应用程序
      template: "./public/index.html",
      chunks: ["page1"] // html-webpack-plugin的新版本中解决了这一问题。在html里面只会引入page1
    })
  ],
  stats: { // 方便观看
    colors: true,
    chunks: false,
    modules: false
  }
};