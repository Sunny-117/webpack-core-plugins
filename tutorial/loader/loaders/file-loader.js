const path = require('path');
const {getOptions,interpolateName} = require('loader-utils');
/**
 * file-loader负责打包加载图片
 * 1.把此文件内容拷贝到目标目录里
 * @param {*} source 
 * @param {*} inputSourceMap 
 * @param {*} data 
 */
function loader(content){
   console.log('这是我们自己的file-loader');
   //this=loaderContext
   let options  = getOptions(this)||{};//获取我们在loader中配置的参数对象
   let filename = interpolateName(this,options.name,{content});
   //其实就是向输出目录里多写一个文件文件名文件名叫filename，内容
   this.emitFile(filename,content);//this.assets[filename]=content;
   if(typeof options.esModule === 'undefined'||options.esModule){
    return `export default "${filename}"`;//es modules
   }else{
    return `module.exports="${filename}"`; //commonjs
   }
}
loader.raw=true;
module.exports = loader;
/**
 * 为什么返回的都是字符串呢？module.exports ？
 * 可以 返回 export default 吗 正确的写法 而不用 module.export.default 不好的 
岁月小小
不是this.options 是options吧 岁月小小
 file.js是指文件被写入dist了吗？ 
 loader。pitch在做什么工作？文件都没读呢 
 loader. pitch  做的事？ ！！！！

 */