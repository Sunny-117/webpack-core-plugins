黄鹏
必须在代码里面写module.hot ，然后自己调用执行函数才可以么？
是的 
有志青年
rOOT是什么 
西瓜籽的夏天
这个 index.js 的 root 和 module怎么拿到的  
如何监听变化的 
fs.watch api
这是一个node的原生方法
node会在内部不停的询问文件的变化
Debugger
webpack 这个命令为啥可以直接运行 
在npm脚本执行的时候，会把
C:\aproject\webpack\10.hmr8080\node_modules\.bin
添加到PATH中

Debugger
.bin 目录的命令是咋添加进去的，
npm i 的时候，会自动将package.json的bin字段放到 node_modules/.bin 下面么
是这样的
学习
用  npm执行verify 


mtmt
1 和 2 是不是写反了？ 
学习
Config.devserver？ 
10:37
杨康
app.listen();
app本身只是一个路由配置

app 和 server 不都是服务吗？为什么感觉起了两个服务 
王凯
没有默认值 ，也不需要给
如果没有配contentbase呢怎么给默认值？ 
我是周杰伦
静态资源服务器只配置了contentBase的话dist文件夹里的静态资源还能访问吗 
能


## 讲一个热更新总体流程
1. 启动一个HTTP服务器，会打包我们的项目，并且让我们可以预览我们的产出的文件，默认端口号8080
2. 还会启动一个websocket双向通信服务器，如果有新的模块发生变更的话，会通过消息的方式通知客户端，让客户端拉取最新代码，并且进行客户端的热更新 
