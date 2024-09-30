let babelCore = require('@babel/core');
let presetEnv = require('@babel/preset-env');
/**
 * babel-loader 作用是调用babelCore
 * babelCore本身只是提供一个过程管理功能，
 *   把源代码转成抽象语法树，进行遍历和生成，它本身也并不知道 具体要转换什么语法，以及语法如何转换
 *   
 * @param {*} source 源文件内容  let sum = (a,b)=>a+b;
 */
function loader(source){
    let es5 = babelCore.transform(source,
        {
            presets:['@babel/preset-env']
        });
    return es5;
}
module.exports = loader;
/*
1.先把ES6转成ES6语法树 babelCore
2.然后调用预设preset-env把ES6语法树转成ES5语法树 preset-env
3.再把ES5语法树重新生成es5代码 babelCore
*/