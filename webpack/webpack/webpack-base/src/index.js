/**
 * loaders 测试
 * */
// 未知数 a = 1;
// 未知数 b = 3;


/**
 * style-loader 测试
 */
// var content = require("./assets/index.css") //交给webpack,分析依赖，读出来文件内容，做抽象语法树分析
// 但是这个css代码不生成抽象语法树，就报错

// console.log(content); //得到css的源码字符串


// 所以可以用loader对css进行转换，让css变成可以识别的代码，可以进行抽象语法树分析

/**
 * img-loader 测试
 */

// var src = require("./assets/webpack.png") // 的却读出来了，但是不能解析成抽象语法树
// console.log(src);
// var img = document.createElement("img")
// img.src = src;
// document.body.appendChild(img);

/**
 * FileListPlugin 测试
 */

require('./a.js')