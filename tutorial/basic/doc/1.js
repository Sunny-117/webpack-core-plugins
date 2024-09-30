const {resolve,join} = require('path');
console.log(resolve('./a','b', 'c'));//会把相对路径转成绝对路径 
console.log(join('a','b'));//join: 机械的连接