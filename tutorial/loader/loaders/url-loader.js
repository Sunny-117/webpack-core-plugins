const path = require('path');
const mime = require('mime');
const {getOptions} = require('loader-utils');

function loader(content){
  console.log(content);
  //content默认格式是字符串
  let options = getOptions(this)||{};
  let {limit=8*1024,fallback="file-loader"}=options;
  const mimeType = mime.getType(this.resourcePath);//image/jpeg
  if(content.length<limit){
    let base64Str = `data:${mimeType};base64,${content.toString('base64')}`
    //13 为啥还stringify? 要让它是一个字符串，而非变量
    return `module.exports = ${JSON.stringify(base64Str)}`;
  }else{
    let fileLoader = require(fallback);
    return fileLoader.call(this,content);
  }
}
//Buffer.toString('base64')
//如果你不希望webpack帮你把内容转成字符串的的话，loader.raw=true;,这样的话content就是一个二进制的Buffer
loader.raw=true;
module.exports = loader;
