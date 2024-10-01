const path = require('path');
function updateCompiler(compiler){
    const options = compiler.options;
    //1来自于webpack-dev-server/client/index.js 它就是浏览里的websocket客户端
    options.entry.main.import.unshift(
        require.resolve('../../client/index.js')
    );
    //2.webpack/hot/dev-server.js 它用来在浏览器里监听发身的事件，进行后续热更新逻辑
    options.entry.main.import.unshift(
        require.resolve('../../../webpack/hot/dev-server.js')
    );
    console.log(compiler.entry);
    //把入口变更之后，你得通知webpack按新的入口进行编译
    compiler.hooks.entryOption.call(options.context,options.entry);
}
module.exports = updateCompiler;
/**
 * webpack4 
 * entry:{
 *   main:['./src/index.js']
 * }
 * webpack5
 * entry:{
 *   main:{
 *      import:['webpack/hot/dev-server.js','webpack-dev-server/client/index.js','./src/index.js']
 *   }
 * }
 * 
 */