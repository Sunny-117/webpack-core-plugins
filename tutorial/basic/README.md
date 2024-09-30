## 现代软件开发
- 把一个大仓库尽可能拆分成不同的不同的小仓库，不同的模块 monorepo
- webpack webpack-cli webpack-dev-server


## 引入图片的方式
- 放在静态文件根目录里，通过html中的image直接引用，需要配置`devServer.contentBase`
- 通过 require import 引入
```js
const logo = require('./images/logo.png')
const image = new Image();
image.src = logo;
document.body.appendChild(image)
```
- 可以在CSS中通过  url 引入图片  css-loader来进行解析处理
```js
const logo = require('./images/logo.png')
const image = new Image();
image.src = 'http://localhost:9999/logo.png';
document.body.appendChild(image)
```

## url-loader和file-loader
- url-loader是对file-loader的增强
- 判断图片的大小是否大于limit,如果大于的话就会把工作交给file-loader处理
- 如果是小于的话，就转成base64自己处理

##  file-loader只是拷贝过去吗？不是吧img处理城js模块吗？
file-loader 
1.拷贝图片
2.把图片模块变成JS模块

## 为什么安装了babel-loader还要安装env，babel-loader不包括这些吗 

- babel-loader 默认换器
- babel-core
- babel-preset-env

```js
let babelCore = require('@babel/core');
let presetEnv = require('@babel/preset-env');
/**
 * babel-loader 作用是调用babelCore
 * 但是babelCore本身只是提供一个过程管理功能，
 * 把源代码转成抽象语法树，进行遍历和生成，它本身也并不知道 具体要转换什么语法，以及语法如何转换
 *   
 * @param {*} source 源文件内容  let sum = (a,b)=>a+b;
 */
function loader(source){
    let es5 = babelCore.transform(source,
        {
            presets:['@babel/preset-env']
        });
    return es5;
}
module.exports = loader;
/*
1.先把ES6转成ES6语法树 babelCore
2.然后调用预设preset-env把ES6语法树转成ES5语法树 preset-env
3.再把ES5语法树重新生成es5代码 babelCore
*/
```



## 1. path的区别和联系？
- publicPath可以看作是devServer对生成目录`dist`设置的虚拟目录，devServer首先从devServer.publicPath中取值，如果它没有设置，就取 `output.publicPath`的值作为虚拟目录，如果它也没有设置，就取默认值 `/`
- `output.publicPath`不仅可以影响虚拟目录的取值，也影响利用`html-webpack-plugin`插件生成的index.html中引用的js、css、img等资源的引用路径。会自动在资源路径前面追加设置的output.publicPath
- 一般情况下都要保证`devServer`中的`publicPath`与`output.publicPath`保持一致


|类别|配置名称|描述|
|:----|:----|:----|
|output|path|指定输出到硬盘上的目录|
|output|publicPath|表示的是打包生成的index.html文件里面引用资源的前缀|
|devServer|publicPath|表示的是打包生成的静态文件所在的位置(若是devServer里面的publicPath没有设置，则会认为是output里面设置的publicPath的值)|
|devServer|contentBase|用于配置提供额外静态文件内容的目录|

## 2.legacy 和loose 参数
- [babel-plugin-proposal-decorators](https://babeljs.io/docs/en/babel-plugin-proposal-decorators)
- legacy 使用旧的(stage 1的装饰器语法和行为)
- [babel-plugin-proposal-class-properties](https://babeljs.io/docs/en/babel-plugin-proposal-class-properties)


## 测试环境和开发环境没有布署map文件，如何进行源码调试?
## babel-runtime?
## pre commit husky ?

## 引入第三方库的时候
- 1.直接引入 痛点是比较麻烦，每次都要引
- 2.插件引入  方便点是不需要手工引了，直接 就能用。缺点是无法在全局下使用
- 3.expose-loader引入
- 4 CDN 需要我们手工的导入插件CDN脚本，而且不管代码里用到没有用到，我们都会引入
- webpack插件：HtmlWebpackExternalsPlugin


## 疑问解答
- 环境变量配置 1.6 模式(mode)

### 两个变量 
1. 一个是在模块内部使用的变量
```js
new webpack.DefinePlugin({
    "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV)
}),
// index.js
console.log(process.env.NODE_ENV, '模块内部的')
```
2. 一个是在node环境也就是webpack.config.js里面用的变量
```js
// webpack在打包的时候在node环境下的变量
// process才是真正的node里的进程对象
console.log('webpack.config.js process.env.NODE_ENV', process.env.NODE_ENV);
```

### 命令行配置
1. webpack执行时候，mode默认值是production,它模块内可以读到
2. 可以通过--mode=development来改变mode值
3. 可以通过--env=development传参，传给webpack配置文件中导出的函数参数env了

```json
"scripts": {
    "build": "cross-env NODE_ENV=production webpack",
    "start": "cross-env NODE_ENV=development webpack serve"
},
```

```json
"scripts": {
    "build": "webpack --mode=production",
    "start": "webpack serve --mode=development"
},
```

```json
"scripts": {
    "build": "webpack --env=production",
    "start": "webpack serve --env=development"
},
```


##  sourcemap调试 2.7.4 组合规则


- pre commit husky ? 4.1 git规范和changelog
## 配置文件写法

- 一般都会有四到五种
- .postcssrc
- postcss.config.js
- postcss.config.json
- 直接写在webpack.config.js里

## loader的执行顺序
- 从右向左 从下向上
- use:[1,2,3]   执行的时候从 3 2 1

## terser-plugin和production压缩js的效果是差不多吗 ？
mode=production的话内部会启动terser-plugin进行压缩
mode=development的话，内部不会自动启用terser-plugin,你要还想压缩就得自己配terser-plugin
## hash
1.用chunkhash的话，改了CSS，是不是JS的hash也会变？ 
会的，只要是同一个chunk,任意一个模块改变， chunkhash就会改变
2.如果 用了import（） 动态引入，import，内容发生了变化。 chunkhash 也会发现变?
import()动态代码分割，分生成一个独立的代码块

## 1.给 webpack命令传参
- 通过命令行 webpack --watch
- 通过配置文件 watch:true


## 1.老师，bundle、chunk怎么理
- 后面给大家实现过程
- 分析入口，分析依赖，生成模块，生成chunk,生成bundle
- 每个入口一般来说会生成一个chunk,一个代码会生成一个bundle打包的资源文件)

## 2.hash,chunkhash ,contenthash 又什么区别？
- md5

## 3.热更新的配置问题
- 
- html的热更新
- js的热更新
- css的热更新


## 注意
- webpack 没有bundle这个概念的
- 有assets 产出的资源文件

那A和B共用一个模块呢，chunk就粘在一起了？split chunks
