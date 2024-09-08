/**
 * 我们打包的时候 module=>chunk=>asset=>file
 * compilation上可以得到本次编译出来module chunk assets信息
 */
class AssetsPlugin{
    constructor(options){
        this.options = options;
    }
    //compiler创建后,会挂载所有的钩子 new DonePlugin().apply(compiler);
    apply(compiler){
       compiler.hooks.compilation.tap('AssetsPlugin',(compilation,params)=>{
        compilation.hooks.chunkAsset.tap('AssetsPlugin',(chunk,filename)=>{
            console.log('chunk',chunk);
            console.log('filename',filename);
        });
       });
    }
}
module.exports = AssetsPlugin;