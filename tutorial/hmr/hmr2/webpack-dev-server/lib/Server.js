
const express = require('express');
const http = require('http');
const updateCompiler = require('./utils/updateCompiler');
const webpackDevMiddleware = require('../../webpack-dev-middleware');
const io = require('socket.io');
class Server{
    constructor(compiler,devServerArgs){
        this.sockets = [];
        this.compiler = compiler;
        this.devServerArgs = devServerArgs;
        updateCompiler(compiler);
        this.setupHooks();//开始启动webpack的编译
        this.setupApp();
        this.routes();
        this.setupDevMiddleware();
        this.createServer();
        this.createSocketServer();
    }
   
    setupDevMiddleware(){
        this.middleware = webpackDevMiddleware(this.compiler);
        this.app.use(this.middleware);
    }
    setupHooks(){
        //当webpack完成一次完整的编译之后，会触发的done这个钩子的回调函数执行
        //编译成功后的成果描述(modules,chunks,files,assets,entries)会放在stats里
        this.compiler.hooks.done.tap('webpack-dev-server',(stats)=>{
            console.log('新的一编译已经完成,新的hash值为',stats.hash);
            //以后每一次新的编译成功后，都要向客户端发送最新的hash值和ok
            this.sockets.forEach(socket=>{
                socket.emit('hash',stats.hash);
                socket.emit('ok');
            });
            this._stats=stats;//保存一次的stats信息
        });
    }
    routes(){
        if(this.devServerArgs.contentBase){
            //此目录将会成为静态文件根目录
           this.app.use(express.static(this.devServerArgs.contentBase));
        }
    }
    setupApp(){
        //this.app并不是一个http服务，它本身其实只是一个路由中间件
        this.app = express();
    }
    createServer(){
        this.server = http.createServer(this.app);
    }
    createSocketServer(){
        //websocket通信之前要握手，握手的时候用的HTTP协议
        const websocketServer = io(this.server);
        //监听客户端的连接
        websocketServer.on('connection',(socket)=>{
            console.log('一个新的websocket客户端已经连接上来了');
            //把新的客户端添加到数组里,为了以后编译成功之后广播做准备
            this.sockets.push(socket);
            //监控客户端断开事件
            socket.on('disconnect',()=>{
                let index = this.sockets.indexOf(socket);
                this.sockets.splice(index,1);
            });
            //如果以前已经编译过了，就把上一次的hash值和ok发给客户端
            if(this._stats){
                socket.emit('hash',this._stats.hash);
                socket.emit('ok');
            }
        });

    }
    listen(port,host,callback){
        this.server.listen(port,host,callback);
    }
}
module.exports = Server;
/**
this.app.listen(); 
var server = http.createServer(this);
return server.listen.apply(server, arguments);
 */