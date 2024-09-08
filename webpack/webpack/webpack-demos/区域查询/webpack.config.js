const baseConfig = require("./webpack.base")
const devConfig = require("./webpack.dev")
const prodConfig = require("./webpack.prod")


// 开发环境和生产环境分别运行，产生的压缩文件不一样
module.exports = function (env) {
    if (env && env.prod) {
        //生产环境
        const config = {
            ...baseConfig,
            ...prodConfig
        }
        config.plugins = [...baseConfig.plugins, ...prodConfig.plugins] //合并一下，防止plugins被覆盖
        return config;
    } else {
        //开发环境
        return {
            ...baseConfig,
            ...devConfig
        }
    }
}