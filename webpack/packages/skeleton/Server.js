const express = require("express");
const http = require("http");
class Server {
  constructor(options) {
    this.options = options;
  }
  listen() {
    const app = express();
    //使用一个静态文件中间件 用来让客户端可以访问staticDir里的文件
    app.use(express.static(this.options.staticDir));
    // 这样创建一个 而不是app.listen是为了可以关闭
    this.httpServer = http.createServer(app);
    return new Promise((resolve) => {
      this.httpServer.listen(this.options.port, () => {
        console.log(`服务器已经在${this.options.port}端口上启动了`);
        resolve();
      });
    });
  }
  async close() {
    return new Promise((resolve) => {
      this.httpServer.close(this.options.port, () => {
        console.log(`${this.options.port}端口服务器已经关闭了`);
        resolve();
      });
    });
  }
}
module.exports = Server;
