const puppeteer = require("puppeteer");
const { readFileSync } = require("fs");
const { resolve } = require("path");
class Skeleton {
  constructor(options) {
    this.options = options;
  }
  async initialize() {
    //打开一个浏览器

    this.browser = await puppeteer.launch({
      headless: false,
    }); //无头 不打开浏览器
  }
  async newPage() {
    let { device } = this.options; //iPhone 6
    let page = await this.browser.newPage();
    await page.emulate(puppeteer.devices[device]);
    return page;
  }
  async makeSkeleton(page) {
    //先读取脚本内容
    let scriptContent = await readFileSync(
      resolve(__dirname, "skeletonScript.js"),
      "utf8"
    );
    //通过addScriptTag方法向页面里注入这个脚本
    await page.addScriptTag({ content: scriptContent });

    //在页面中执行此函数，
    const { html, styles } = await page.evaluate((options) => {
      return skeletonScript.genSkeleton(options);
    }, this.options);
    return { html, styles };
  }
  async genHTML(url) {
    //生成骨架平的DOM字符串
    let page = await this.newPage();
    //networkidle2 网络空闲结束
    let response = await page.goto(url, { waitUntil: "networkidle2" });
    if (response && !response.ok()) {
      //如果访问不成功
      throw new Error(`${response.status} on ${url}`);
    }
    //创建骨架屏
    let result = await this.makeSkeleton(page);
    return result;
  }
  async destroy() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}
module.exports = Skeleton;
