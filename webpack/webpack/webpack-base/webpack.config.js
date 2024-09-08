var baseConfig = require("./webpack.base")
var devConfig = require("./webpack.dev")
var proConfig = require("./webpack.pro")

/**
 * 允许导出一个函数
 * @param {*} env 
 * @returns 
 */
module.exports = function (env) {
    if (env && env.prod) { //生产环境
        return {
            ...baseConfig,
            ...proConfig
        }
    } else { // 开发环境
        return {
            ...baseConfig,
            ...devConfig
        }
    }
}