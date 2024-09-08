
let jszip = require('jszip');
let path = require('path');
let {RawSource} = require('webpack-sources');
class Plugin{
    constructor(options){
        this.options = options;
    }
    apply(compiler){
        let that = this;
        compiler.hooks.emit.tapAsync('ZipPlugin',(compilation,callback)=>{
            let zip = new jszip();
            //compilation.assets里面放着将出产出的所有的资源,包括文件名和文件内容 
            for(let filename in compilation.assets){
                let source = compilation.assets[filename].source();//可以得到此文件源码
                zip.file(filename,source);//往压缩包里放文件,文件名1.txt 文件内容 2
            }
            //emit是件是你修改产出文件的最后机会 emit就是在写入dist目录之前执行的最后一个钩子
            zip.generateAsync({type:'nodebuffer'}).then(content=>{
                compilation.assets[that.options.filename]=new RawSource(content);
                callback();
                /* compilation.assets[that.options.filename]={
                    source(){
                        return content;
                    }
                } */
            });
        });
    }
}
module.exports = Plugin;
/**
写个插件,但是没有思路
抄 ,找一些类似的官方插件,看它的源码,
1.需想求 我们要把所有产出的文件压缩成一个压缩包,然后也输出到目录
  1. 如何得到产出的文件以及产出的文件内容
     1. 拿到产出的文件

  2. 如何把这些文件压缩成一个压缩包 找一个npm包?
 
 */