
let loaderUtils = require('loader-utils');
let postcss = require('postcss');
let Tokenizer = require('css-selector-tokenizer');

function loader(inputSource) {
  let loaderOptions = loaderUtils.getOptions(this) || {};
  let callback = this.async();
  const cssPlugin = (options) => {
    return (root) => {
      if(loaderOptions.import){
        //1.删除所有的@import 2.把导入的CSS文件路径添加到options.imports里
        root.walkAtRules(/^import$/i, (rule) => {
          rule.remove();//在CSS脚本里把这@import删除
          options.imports.push(rule.params.slice(1, -1));//./global.css
        });
      }
      if(loaderOptions.url){
        //2.遍历语法树，找到里面所有的url
        //因为这个正则只能匹配属性
        root.walkDecls(/^background-image/,decl => {
          let values = Tokenizer.parseValues(decl.value);
          values.nodes.forEach(node => {
            node.nodes.forEach(item => {
              if (item.type === 'url') {
              //stringifyRequest可以把任意路径标准化为相对路径
              let url = loaderUtils.stringifyRequest(this,item.url);
              item.stringType = "'";
              item.url = "`+require("+url+")+`";
              //require会给webpack看和分析，webpack一看你引入了一张图片
              //webpack会使用file-loader去加载图片
              }
            });
          });
          let value = Tokenizer.stringifyValues(values);
          decl.value = value;
        });
      }
    }
  }
  //将会用它来收集所有的@import
  let options = { imports: [] };
  let pipeline = postcss([cssPlugin(options)]);
  pipeline.process(inputSource).then(result => {
    let { importLoaders = 0 } = loaderOptions;//几个前置loader
    let { loaders, loaderIndex } = this;//所有的loader数组和当前loader的索引
    let loadersRequest = loaders.slice(
      loaderIndex,
      loaderIndex + 1 + importLoaders
    ).map(x => x.request).join('!');//request是loader绝对路径
    // -!css-loader.js的绝对路径!less-loader.js的绝对路径!./global.css
    //-!	不要前置和普通 loader
    //stringifyRequest 把请求转成字符串 ""
    //loader-utils中的stringifyRequest方法,可以将绝对路径转化为相对路径。
    // c://loader.js=>./src/loader.js ""
    console.log('loadersRequest', loadersRequest);
    let importCss = options.imports
      .map((url) => `list.push(...require(` +
        loaderUtils.stringifyRequest(this, `-!${loadersRequest}!${url}`) + `));`).join("\r\n");
    let script = `
         var list = [];
         list.toString = function(){return this.join('')}
         ${importCss}
         list.push(\`${result.css}\`);
         module.exports = list;
      `;
    callback(null, script);
  });
}

module.exports = loader;
//js babel
//css postcss
//返回的是数组哪里处理的 

/**
 * 特别要注意几个东西
 * 什么代码是在什么时候执行的
 * css-loader是在webpack处理index.js里的index.css依赖的时候执行
 * 返回此代码
 * var list = [];
   list.toString = function(){return this.join('')}
   //webpack分分析这个依赖，并且打包./global.css,也会走css-loader
   list.push(...require('./global.css'));
   list.push(...require('./src/global.css'));
   ${importCSS}
   list.push(\`${result.css}\`);
   module.exports = list;
   此代码也是JS的，然后给了webpack
   webpack也要把它转成JS的抽象语法树，分析require import依赖
   webpack会去处理'./src/global.css'这个依赖

   返回的是数组哪里处理的
岁月小小
文件匹配 /.css/时
岁月小小
给下一个loader吧？
岁月小小
不是给style-loader吗？
等于是require一个css，的时候cssloader还会处理他，cssloader返回的是数组，所以。。

 */