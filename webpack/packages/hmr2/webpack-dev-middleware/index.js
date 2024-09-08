/**
 * webpack开发中间件
 * 1.真正的以监听模式启动webpack的编译
 * 2.返回一个express中间件，用来预览我们产出的资源文件
 * @param {*} compiler 
 */
const MemoryFileSystem = require('memory-fs');
const fs = require('fs');
const memoryFileSystem = new MemoryFileSystem();
const middleware = require('./middleware');
function webpackDevMiddleware(compiler){
    //1.真正的以监听模式启动webpack的编译
    compiler.watch({},()=>{
        console.log('监听到文件变化，webpack重新开始编译');
    });
    //产出的文件并不是写在硬盘上了，为提供性能，产出的文件是放在内存里，所以你在硬盘上看不见
    //当webpack准备写入文件的时候，是用的compiler.outputFileSystem来写入
    //let fs = compiler.outputFileSystem = memoryFileSystem;
    return middleware({
        fs,
        outputPath:compiler.options.output.path//写入到哪个目录里去
    });

}
module.exports = webpackDevMiddleware;