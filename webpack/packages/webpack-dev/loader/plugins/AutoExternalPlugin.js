/**
 * 通过此插件完成2件事
 * 1. 自动向index.html里插入CDN脚本
 * 2. 当通过require或import引入模块的,变成一外部模块,而不进行打包
 * 3. 外链的模块和CDN的地址是可以随时修改
 */
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExternalModule = require('webpack/lib/ExternalModule');
class Plugin{
    constructor(options){
        this.options = options;//{jquery:{expose,url}}
        this.importedModules = {};
    }
    apply(compiler){
        let thisPlugin = this;
        //介入修改生产模块的过程,如果要引入的模块是配置过外链的话,就需要走外部模块生成方式了
        //当创建一个模块工厂的时候,会触发这个钩子执行,参数普通模块工厂
        compiler.hooks.normalModuleFactory.tap('AutoExternalPlugin',(normalModuleFactory)=>{
            //实现一个需求 如果一个模块在项目中引用了才外链对应的资源,如果没有引用则不引入外链CDN资源
            //回顾我们编译模块的过 1.找到原始文件2 走loader转换得到一个js代码块 3.为这个JS代码块创建parser,转换并遍历语法树.找到里面的require和import
            normalModuleFactory.hooks.parser
            .for("javascript/auto")
            .tap("AutoExternalPlugin", (parser) => {
                parser.hooks.import.tap(
                "AutoExternalPlugin",
                (statement, source) => {
                    thisPlugin.importedModules[source]=true;
                }
                );
            });

            normalModuleFactory.hooks.parser
            .for('javascript/auto')
            .tap('AutoExternalPlugin',(parser)=>{
                parser.hooks.call.for("require")
                .tap("AutoExternalPlugin", expr => {
                    let value = expr.arguments[0].value;//jquery loadsh
                    thisPlugin.importedModules[value]=true;
                }); 
            })
            //factory是工厂生产模块的钩子
            //normalModuleFactory用来根据模块信息创建模块的, data就是要创建的模块信息
            //factory是原来的模块工厂的创建模块的方法,返回新的创建模块的方法
            //factory工厂方法是一个函数接收原材料 data=./src/index.js 返加创好的模块 callback(null,normalModule)
            //改造factory, 修改生产逻辑,返回的函数将会成了真正的normalModuleFactory.factory方法,生成模块的方式 
            normalModuleFactory.hooks.factory.tap('AutoExternalPlugin',(factory)=>(data,callback)=>{
                //console.log('data',data);
                //let dependency = data.dependencies[0];//获取依赖,其实就是模块信息的意思
                //let value = dependency.request;//
                let request =data.request;//要编译生成模块的ID,或者说生产的路径文件路径 jquery
                if(this.options[request]/*如果说这个模块已配置了外链了*/){
                    let variable = this.options[request].expose;//expose:'jQuery'
                    console.log('variable',variable);// request jquery
                    callback(null,new ExternalModule(variable,'window',request));// = window.variable window.jQuery
                }else{
                    factory(data,callback);
                }
            });
        });

        compiler.hooks.compilation.tap('AutoExternalPlugin',(compilation)=>{
            //在老版html-webpack-plugin插件里,是直接给compilation.hooks加了一个钩子htmlWebpackPluginAlterAssetTags
            //新版的html-webpack-plugin插件,HtmlWebpackPlugin.getHooks(compilation).alterAssetTags
            HtmlWebpackPlugin.getHooks(compilation).alterAssetTags.tapAsync('AutoExternalPlugin',
            (htmlPluginData,callback)=>{
                //['jquery','lodash']=>['jquery']
                //jquery是模块名 jQuery是导入CDN脚本挂到window上的全局变量名
                //console.log('thisPlugin.importedModules',thisPlugin.importedModules);
                Object.keys(thisPlugin.options).filter(key=>thisPlugin.importedModules[key]).forEach(name=>{
                let {expose,url} = thisPlugin.options[name];
                   htmlPluginData.assetTags.scripts.unshift({
                    tagName: 'script',
                    voidTag: false,
                    attributes: { defer: false, src: url }
                  });
                })
                callback(null,htmlPluginData);
            });
            
        });
        
    }
}
module.exports = Plugin;