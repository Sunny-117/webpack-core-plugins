let {SyncHook} = require('tapable');
const path = require('path');
const fs = require('fs');
const types = require('babel-types');
const parser = require('@babel/parser');//源代码转成AST抽象语法树
const traverse = require('@babel/traverse').default;//遍历语法树
const generator = require('@babel/generator').default;//把语法树重新生成代码
//path.posix.sep / path.sep不同操作系统的路径分隔符 \/
function toUnixPath(filePath){
  return filePath.replace(/\\/g,'/');
}
//根目录，当前工作目录
let baseDir  = toUnixPath(process.cwd());
class Compiler{
    constructor(options){
        this.options = options;
        this.hooks = {
            run:new SyncHook(),//会在开始编译的时候触发
            emit:new SyncHook(),//会在将要写入文件的时候触发
            done:new SyncHook()//会在完成编译的时候触发
        }
        this.entries = new Set();//这个数组存放着所有的入口
        this.modules = new Set();//这里存放着所有的模块
        this.chunks = new Set();//webpack5 this.chunks = new Set();
        this.assets = {};//输出列表 存放着将要产出的资源文件
        this.files = new Set();//表示本次编译的所有产出的文件名
    }
    //4.执行对象的run方法开始执行编译
    run(callback){
       //当调用run方法的时候会触发run这个钩子, 进而执行它的回调函调 
       this.hooks.run.call(); 
       //5.根据配置中的entry找出入口文件,得到entry的绝对路径
       //C:\aproject\webpack\5.flow\src\index.js
       //打包后的文件，所有的路径都是\ => /
       let entry = {};
       if(typeof this.options.entry === 'string'){
          entry.main=this.options.entry;
       }else{
         entry=this.options.entry;
       }
       for(let entryName in entry){
        let entryFilePath =toUnixPath(path.join(this.options.context,entry[entryName]));
        //6.从入口文件出发,调用所有配置的Loader对模块进行编译
        let entryModule =  this.buildModule(entryName,entryFilePath);
        //this.modules.add(entryModule);
        //7.根据入口和模块之间的依赖关系，组装成一个个包含多个模块的 Chunk
        let chunk = {name:entryName,entryModule,modules:this.modules.filter(module=>module.name===entryName)}; 
        this.chunks.add(chunk);
        this.entries.add(chunk);//也是入口代码块
       }
      
       //8.再把每个Chunk转换成一个单独的文件加入到输出列表
       //一个 chunk会成为this.assets对象的一个key value
       //一个chunk对应this.assets的一个属性，而每个assets属性会对应一个文件file
      /*  this.chunks.forEach(chunk=>{
        //key文件名 值是打包后的内容
        let filename = this.options.output.filename.replace('[name]',chunk.name);   
        let targetPath = path.join(this.options.output.path,filename);//page1.js page2.js
        fs.writeFileSync(targetPath,getSource(chunk));
      }); */

       this.chunks.forEach(chunk=>{
           //key文件名 值是打包后的内容
         let filename = this.options.output.filename.replace('[name]',chunk.name);   
         this.assets[filename]=getSource(chunk);
       });
       this.hooks.emit.call();    
       //8.在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统
       this.files = Object.keys(this.assets);//['main.js']
       //存放本次编译输出的目标文件路径
       for(let file in this.assets){
          let targetPath = path.join(this.options.output.path,file);//page1.js page2.js
          fs.writeFileSync(targetPath,this.assets[file]);
       }
       this.hooks.done.call();    
       callback(null,{//此对象stats 统计信息，表示本次编译结果的描述信息对象
        toJson:()=>{
           return {
            entries:this.entries,
            chunks:this.chunks,
            modules:this.modules,
            files:this.files,
            assets:this.assets
           }
         }
       });
    }
    /**
     * 编译模块 1.读取模块文件
     * @param {*} modulePath 
     */
    buildModule=(name,modulePath)=>{
        //读取原始源代码
        let originalSourceCode = fs.readFileSync(modulePath,'utf8');
        let targetSourceCode=originalSourceCode;
        //查找此模块对应的loader对代码进行转换
        let rules = this.options.module.rules;
        let loaders = [];
        for(let i=0;i<rules.length;i++){
            //正则匹配上了模块的路径
            if(rules[i].test.test(modulePath)){
                loaders=[...loaders,...rules[i].use];
            }
        }
        //loaders=['logger1-loader.js','logger2-loader.js','logger3-loader.js','logger4-loader.js']
        for(let i=loaders.length-1;i>=0;i--){
            let loader = loaders[i];
            targetSourceCode=require(loader)(targetSourceCode);
        }
        let moduleId = './'+path.posix.relative(baseDir,modulePath);
        //webpack最核心 的几个概念要出场了 module 模块ID ，依赖的数组
        let module = {id:moduleId,dependencies:[],name};
        //现在我们已经得到转换后的代码 babel-loader es6=>es5
        //再找出该模块依赖的模块，再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理
        let astTree = parser.parse(targetSourceCode,{sourceType:'module'});
        //遍历语法树，并找出require节点
        traverse(astTree,{
            CallExpression:({node})=>{
                if(node.callee.name === 'require'){
                    //1.相对路径 2.相对当前模块  
                    //2.绝对路径
                    let moduleName = node.arguments[0].value;
                    //要判断一个moduleName绝对还是相对，相对路径才需要下面的处理
                    //获取路径所有的目录
                    //C:\aproject\webpack\5.flow\src
                    let dirname = path.posix.dirname(modulePath);
                    //C:\aproject\webpack\5.flow\src\title
                    let depModulePath = path.posix.join(dirname,moduleName);
                    let extensions = this.options.resolve.extensions;
                    //C:\aproject\webpack\5.flow\src\title.js
                    depModulePath = tryExtensions(depModulePath,extensions,moduleName,dirname);
                    //模块ID的问题 每个打包后的模块都会有一个moduleId
                    //"./src/title.js"  depModulePath=/a/b/c  baseDir=/a/b relative=>c ./c
                    let depModuleId = './'+path.posix.relative(baseDir,depModulePath);//./src/title.js
                    //修改抽象语法树
                    node.arguments = [types.stringLiteral(depModuleId)];
                    module.dependencies.add(depModulePath);
                }
            }
        });
        //根据新的语法树生成新代码
        let {code}=generator(astTree);
        module._source = code;//转换后的代码 module moduleId dependencies _source
        //再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理
        module.dependencies.forEach(dependency=>{
            let dependencyModule = this.buildModule(name,dependency);
            this.modules.add(dependencyModule);
        });
        return module;
    }
}
//let chunk = {name:'main',entryModule,modules:this.modules}; 
function getSource(chunk){
   return `
   (() => {
    var modules = {
      ${
          chunk.modules.map(module=>`
          "${module.id}": (module,exports,require) => {
            ${module._source}
          }`).join(',')
      }
    };
    var cache = {};
    function require(moduleId) {
      if (cache[moduleId]) {
        return cache[moduleId].exports;
      }
      var module = (cache[moduleId] = {
        exports: {},
      });
      modules[moduleId](module, module.exports, require);
      return module.exports;
    }
    (() => {
     ${chunk.entryModule._source}
    })();
  })();
   `;
}
function tryExtensions(modulePath,extensions,originalModulePath,moduleContext){
    for(let i=0;i<extensions.length;i++){
       if(fs.existsSync(modulePath+extensions[i])){
        return modulePath+extensions[i];
       }
    }
    throw new Error(`Module not found: Error: Can't resolve '${originalModulePath}' in '${moduleContext}'`);
}
module.exports = Compiler;