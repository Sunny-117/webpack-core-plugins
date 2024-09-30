/**
 * webpack有二种用法
 *   webpack-dev-server
 *   express服务器+webpack-dev-middleware=webpack-dev-server
 */
const express = require('express');
// 如果你已经有一个express服务器，想添加打包功能
const app = express();
const webpack = require('webpack');
const WebpackDevMiddleware = require('webpack-dev-middleware');
const webpackOptions = require('./webpack.config');

webpackOptions.mode = 'development';
// compiler 是webpack工作的主要对象
const compiler = webpack(webpackOptions);
// WebpackDevMiddleware会返回一个express中间件
// 1.会启动webpack的编译，产出a.hash.js b.hash.js
// 2.它会返回一个中间件，当接受到客户端对这些产出文件的请求时，把文件内容返回结
app.use(WebpackDevMiddleware(compiler, {}));
app.listen(9000);
