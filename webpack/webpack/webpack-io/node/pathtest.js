//该对象提供了大量路径处理的函数

var path = require("path") //导出了一个对象

// var result = path.resolve("./", "child", "abc", "123");

var result = path.resolve(__dirname, "src"); // 从js所在文件夹
console.log(result);