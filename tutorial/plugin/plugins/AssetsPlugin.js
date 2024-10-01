/**
 * 我 需要向输出目录里多输出一个文件
 * 你得告诉 webpack你输出的文件名和文件内容
 * assets.md
 * 
 */
const {RawSource} = require('webpack-sources');
class AssetsPlugin{
  apply(compiler){
    /**
     * compiler代表总的编译对象
     * compilation代表一次编译对象
     * module 一个文件对应一个模块
     * 从入口文件出发，它和它依赖的模块组成一个代码块 chunk.name main
     * 一般来说一个chunk会生成一个asset，也就是一个资源文件 main.js
     */
    compiler.hooks.emit.tapAsync('AssetsPlugin',(compilation,callback)=>{
      console.log(compilation.assets);
      let assetList = ``;
      for(let file in compilation.assets){
        let source = compilation.assets[file].source();
        assetList+=`${file} ${source.length} bytes\r\n`;
      }
      compilation.assets['assets.md'] = new RawSource(assetList);
     /*  compilation.assets['assets.md'] = {
        source(){
          return assetList
        }
      } */
      callback();
     /*  compilation.hooks.chunkAsset.tap('AssetsPlugin',(chunk,filename)=>{
        console.log(chunk.name,filename);
      }); */
      //当所有的资源文件都准备就绪，准备写入硬盘的时候会触发这个钩子,它是你修改输出文件的最后机会
      /* compilation.hooks.emit.tap('AssetsPlugin',(chunk,filename)=>{
        console.log(chunk.name,filename);
      }); */
    });
  }
}
module.exports = AssetsPlugin;