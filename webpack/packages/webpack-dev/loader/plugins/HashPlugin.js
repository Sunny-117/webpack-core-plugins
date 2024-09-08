
class Plugin{
    constructor(options){
        this.options = options;
    }
    apply(compiler){
        compiler.hooks.compilation.tap('Plugin',(compilation,params)=>{
            compilation.hooks.afterHash.tap('Plugin',()=>{
                let tsHash = Date.now()+"";
                compilation.hash ='hash'+tsHash;//本次编译的 hash
                for(let chunk of compilation.chunks){
                    chunk.contentHash = {'javascript':'contentHash'+tsHash};//每个代码的内容hash contentHash
                    chunk.renderedHash='chunkHash'+tsHash;//代码块的 chunkHash
                    console.log(chunk);
                }
             
            });
        });
    }
}
module.exports = Plugin;
//	this.hooks.contentHash.call(chunk);