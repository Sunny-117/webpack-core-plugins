
class DonePlugin{
    constructor(options){
        this.options = options;
    }
    //compiler创建后,会挂载所有的钩子 new DonePlugin().apply(compiler);
    apply(compiler){
        compiler.hooks.done.tapAsync('DonePlugin',(stats,callback)=>{
            console.log(this.options.message);
            callback();
        });
    }
}
module.exports = DonePlugin;