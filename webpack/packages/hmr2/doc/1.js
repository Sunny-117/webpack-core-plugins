
let path = require('path');
//从当前路径出发，得到一个绝对路径
console.log(path.resolve('./webpack'));
//解析模块路径
console.log(require.resolve('./webpack'));