/**
 * 我 需要向输出目录里多输出一个文件
 * 你得告诉 webpack你输出的文件名和文件内容
 * assets.md
 * 
 */
//const {RawSource} = require('webpack-sources');
let JSZIP = require('jszip');
const path = require('path');
class RawSource{
  constructor(source){
    this._source = source;
  }
  source(){
    return this._source;
  }
  size(){
    return this._source.length;
  }
}
/**
 * 希望把输出的文件打成一个压缩包做成一个存档文件
 */
class ZipPlugin{
  apply(compiler){
    compiler.hooks.emit.tapAsync('ZipPlugin',(compilation,callback)=>{
        let zip = new JSZIP();
        for(let filename in compilation.assets){
          let source = compilation.assets[filename].source();
          zip.file(filename,source);
        }
        zip.generateAsync({type:'nodebuffer'}).then(content=>{
          compilation.assets['assets.zip']=new RawSource(content);
          callback();
        });
    });
  }
}
module.exports = ZipPlugin;