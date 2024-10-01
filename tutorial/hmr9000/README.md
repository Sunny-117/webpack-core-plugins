

修改entry 入口，加了二个文件
updateCompiler中只是通知，webpack入口文件发生了变化！
compiler.watch 开始编译并监听文件变化

但是监听却是在webpackdeviddleware中！岂不是先通知后监听？

为什么修改了index.js会自动打包出来hot-updata文件！，这个是在哪里处理的
这个是在HotModuleReplacementPlugin创建 
old Stats
new Stats

let oldStats = {
    chunks:[
       { name:'main',
        modules:[module1,module2]}
    ]
}
let newStats = {
    chunks:[
       { name:'main',
        modules:[新的module1,module2]}
    ]
}

watch不是在文件发生变化才打包吗？第一次执行的时候文件没有变化，怎么打包呢？ 
不是。
肯定要先开始编译，先编译至少一次，并且监听

compile.run();编译一次退出
compiler.runAndWatch()编译一次，然后不退后，继续监听文件变化，

watch 监听文件变化，如果发生文件变化，会重新进行编译，然后出发告诉客户端（使用socket）,然后客户端会请求 json 文件，然后请求js文件。 
 完美

每次编译之后会有HotModuleReplacementPlugin生成
hot-updata.json ，hot-updata.js 是那里来的呀， 每次编译后，是webpack 自动就生成好了么？ 
大力威
插件生成的 


hot-update.js 都是上次的hash吗？ 
是的

大力威
老师 http拦截那 是个什么套路来着 
黄鹏
webpack5 模块联邦 是啥？ 
 这个我们会详细讲
 
