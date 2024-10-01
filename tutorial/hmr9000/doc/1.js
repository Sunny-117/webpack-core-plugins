
let path = require('path');
//从当前路径出发，得到一个绝对路径
//C:\aproject\webpack\10.hmr9000\doc\b
console.log(path.resolve('./webpack'));
//解析模块路径
//c:\aproject\webpack\10.hmr9000\node_modules\webpack\lib\index.js
console.log(require.resolve('./webpack'));
