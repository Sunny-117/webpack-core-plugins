/**
 * 这个express中间件负责提供产出文件的预览
 * 拦截HTTP请求，看看请求的文件是不是webpack打包出来的文件。
 * 如果是的话，从硬盘上读出来，返回给客户端
 */
let mime = require('mime')
let path = require('path')
function wrapper({fs,outputPath}){
   return (req,res,next)=>{
        let url = req.url;//http://localhost:9000/main.js
        if(req.url === '/favicon.ico') return res.sendStatus(404);
        if(url === '/') url = "/index.html";
        //outputPath = path.resolve(__dirname,'dist')
        //url =/main.js
        //filename = C:\aproject\webpack\10.hmr9000\dist/main.js
        let filename = path.join(outputPath,url);
        console.log(filename);
        try{
            let stat = fs.statSync(filename);
            if(stat.isFile()){
                let content = fs.readFileSync(filename);
                //main.js=>application/javascript main.jpe=>image/jpeg
                res.setHeader('Content-Type',mime.getType(filename));
                return res.send(content);
            }else{
               return  res.sendStatus(404);
            }
        }catch(error){
            console.log(error);
            return next(error);
        }
   }
}

module.exports = wrapper;
//他这个读取文件也是一下全读出来？ 
/**
他这个读取文件也是一下全读出来？ 
watch监听的改变，会自动编译吗  是的
以前的确不好办，但面wepback5硬缓存厉害多了
webpack 文件太多，都读到内存里面去了，然后导致一次编译需要20s， 这个怎么办呀。 
老师  中午能传下视频吗 
12:05
毛子哥
插件生成的
文件名后面的hot-updata怎么来的 
大力威撤回了一条消息
大力威撤回了一条消息
aaa
走到catch了吧 
aaa
打印一下error 
aaa
看下 
Debugger
mime 没 install 吧 
九殇
安装mime 
aaa
看下聊天吧求求了 
毛子哥
这框框的写 

 */
