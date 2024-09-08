/*
 * @Author: 付志强 zhiqiangfu6@gmail.com
 * @Date: 2022-11-09 10:04:05
 * @LastEditors: 付志强 zhiqiangfu6@gmail.com
 * @LastEditTime: 2022-11-10 14:18:45
 * @FilePath: /webpack_learn/5.性能优化/手动分包/webpack.dll.config.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const webpack = require("webpack");
const path = require("path");

module.exports = {
  mode: "production",
  entry: {
    jquery: ["jquery"],
    lodash: ["lodash"]
  },
  output: {
    filename: "dll/[name].js",
    library: "[name]" // 每个bundle暴露的全局变量名
  },
  plugins: [
    // DllPlugin: 生成资源清单
    new webpack.DllPlugin({
      path: path.resolve(__dirname, "dll", "[name].manifest.json"),
      name: "[name]"
    })
  ]
};
