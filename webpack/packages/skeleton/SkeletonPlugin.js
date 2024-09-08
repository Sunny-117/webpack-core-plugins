const Server = require("./Server");
const Skeleton = require("./Skeleton");
const { resolve } = require("path");
const { readFileSync, writeFileSync } = require("fs-extra");
class SkeletonPlugin {
  constructor(options) {
    //
    this.options = options; //{staticDir,port,origin}
  }
  //代表webpack编译对象
  apply(compiler) {
    //compiler身上会有很多的钩子，我们可以通过tap来注册这些钩子函数的监听
    //当这个钩子出发的时候，会调用我们的监听函数
    //done整个编译流程都走完了，dist目录下的文件都生成了就可以出发done的回调执行了
    compiler.hooks.done.tap('SkeletonPlugin', async () => {
      await this.startServer(); //启动一个http服务器
      this.skeleton = new Skeleton(this.options);
      await this.skeleton.initialize(); //启动一个无头浏览器
      //生成骨架屏的html和style
      const { html, styles } = await this.skeleton.genHTML(`http://localhost:${this.options.port}`);

      const originPath = resolve(this.options.staticDir, "index.html");
      const originHTML = await readFileSync(originPath, "utf8");
      const htmlArr = originHTML
        .replace(/<body>[\s\S]*<\/body>/, html)
        .split("</head>");
      await writeFileSync(
        originPath,
        `${htmlArr[0]}${styles}\n</head>\n${htmlArr[1]}`
      );
      await this.skeleton.destroy(); //再销毁无头浏览器
      await this.server.close(); //完事后要关闭服务器
    });
  }
  async startServer() {
    this.server = new Server(this.options); //创建服务
    await this.server.listen(); //启动这个服务器
  }
}
module.exports = SkeletonPlugin;
