var path = require("path")

/**
 * 规则：

● name：chunkname
● hash: 总的资源hash，通常用于解决缓存问题。哈希就是根据文件内容生成出来的。内容变化，哈希变化。反之，就算文件内容有所改变，浏览器会用缓存，对于更新的文件无动于衷
● chunkhash: 使用chunkhash
● id: 使用chunkid,不推荐。会导致生产环境和开发环境的名字不一致。

 */
module.exports = {
    mode: "production",
    entry: { // 多个chunk入口的时候需要有一个动态规则出口
        main: "./src/index.js", //属性名：chunk的名称， 属性值：入口模块（启动模块）
        // a:"src/a.js"一个启动模块
        a: ["./src/a.js", "./src/index.js"] //启动模块可以有两个
    },

    output: { // 打包出口
        path: path.resolve(__dirname, "target"), //必须配置一个绝对路径，表示资源放置的文件夹，默认是dist
        filename: "[id].[chunkhash:5].js" //配置的合并的js文件的规则
        // filename:"script/abc/bundle.js" 静态规则：打包在target子文件夹script的abc的bundle.js里面
    },
    devtool: "source-map"
}