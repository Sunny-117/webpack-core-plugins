
class RunPlugin{
    constructor(options){
        this.options = options;
    }
    //每个插件定死了有一个apply方法
    apply(compiler){
        //监听感兴趣的钩子
        compiler.hooks.run.tap('RunPlugin',()=>{
            console.log('RUN1~~~~~~~~~~~~~~~~~~~');
        });
    }
}
module.exports = RunPlugin;