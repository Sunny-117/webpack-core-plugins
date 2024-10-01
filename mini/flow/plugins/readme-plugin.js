
class ReadmePlugin{
    constructor(options){
        this.options = options;
    }
    //每个插件定死了有一个apply方法
    apply(compiler){
        //监听感兴趣的钩子 注册监听函数
        compiler.hooks.emit.tap('ReadmePlugin',()=>{
            //让你在可以在插件改变输出的结果
            // compiler.assets['README.md']="读我读我";
        });
    }
}
module.exports = ReadmePlugin;
