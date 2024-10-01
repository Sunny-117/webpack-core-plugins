let Compiler = require('./Compiler');
/**
 * process.argv 命令行参数
 * @param {*} options 
 */
function webpack(options){
  //1.初始化参数：从配置文件和Shell语句中读取并合并参数,得出最终的配置对象
  //console.log(process.argv);
  //shell命令行参数对象 
  let shellConfig = process.argv.slice(2).reduce((shellConfig,item)=>{
    let [key,value]= item.split('=');//item='--mode=development',
    shellConfig[key.slice(2)]=value;
    return  shellConfig;
  },{});
  let finalOptions = {...options,...shellConfig};//得出最终的配置对象
  //2.用上一步得到的参数初始化Compiler对象
  let compiler = new Compiler(finalOptions);
  //3.加载所有配置的插件
  //finalOptions.plugins.forEach();
  if(finalOptions.plugins&&Array.isArray(finalOptions.plugins)){
     for(let plugin of finalOptions.plugins){
       //刚开始的时候，就会执行所有的插件实例的apply方法，并传递compiler实例
       //所以说插件是在webpack开始编译之前全部挂载的
       //但是要到插件关注的钩子触发的时候才会执行
        plugin.apply(compiler);
     }
  }
  return compiler;
}
module.exports = webpack;