(()=>{
  //存放着所有的模块定义，包括懒加载，或者说异步加载过来的模块定义
  var modules = ({});
  var cache = {};
  //因为在require的时候，只会读取modules里面的模块定义
  function require(moduleId){
    if(cache[moduleId]){//先看缓存里有没有已经缓存的模块对象
      return cache[moduleId].exports;//如果有就直接返回
    }
    //module.exports默认值 就是一个空对象
    var module = {exports:{}};
    cache[moduleId]= module;
    //会在模块的代码执行时候给module.exports赋值
    modules[moduleId].call(module.exports,module,module.exports,require);
    return module.exports;
  }
  require.f={};
  //如何异步加载额外的代码块 chunkId=hello
  //2.创建promise，发起jsonp请求
  require.e =(chunkId)=>{
    let promises = [];
    require.f.j(chunkId,promises);
    return Promise.all(promises);//等这个promise数组里的promise都成功之后
  }
  require.p='';//publicPath 资源访问路径
  require.u = (chunkId)=>{//参数是代码块的名字，返回值是这个代码的文件名
    return chunkId+'.main.js';
  }
  //已经安装的代码块 main代码块的名字：0表示已经就绪
  let installedChunks = {
    main:0,
    hello:0
  }
  //3.通过jsonp异步加载chunkId,也就是hello这个代码块
  require.f.j = (chunkId,promises)=>{
    //创建一个新的promise,放到了数组中去
   let promise = new Promise((resolve,reject)=>{
    installedChunks[chunkId]=[resolve,reject];
   });
   promises.push(promise);
   var url = require.p+require.u(chunkId);// /hello.main.js
   require.l(url);
  }
  //http://127.0.0.1:8082/hello.main.js
  //4.通过JSONP请求这个新的url地址
  require.l = (url)=>{
     let script = document.createElement('script');
     script.src = url;
     document.head.appendChild(script);// 一旦添加head里,浏览器会立刻发出请求
  }
  //6.开始执行回调
  var webpackJsonpCallback = ([chunkIds,moreModules])=>{
    //chunkIds=['hello']=>[resolve,reject]
    //let resolves = chunkIds.map(chunkId=>installedChunks[chunkId][0]);
    let resolves = [];
    for(let i=0;i<chunkIds.length;i++){
      let chunkData = installedChunks[chunkIds[i]];
      installedChunks[chunkIds[i]]=0;
      resolves.push(chunkData[0]);
    }
   
    //把异步加载回来的额外的代码块合并到总的模块定义对象modules上去
    for(let moduleId in moreModules){
      modules[moduleId]= moreModules[moduleId];
    }
    resolves.forEach(resolve=>resolve());
  }
  require.d = (exports,definition)=>{
    for(let key in definition){
      Object.defineProperty(exports,key,{enumerable:true,get:definition[key]});
    }
  }
  require.r = (exports)=>{
    Object.defineProperty(exports,Symbol.toStringTag,{value:'Module'});
    Object.defineProperty(exports,'__esModule',{value:true});
  }
  //0.把空数组赋给了window["webpack5"],然后重写的window["webpack5"].push
  var chunkLoadingGlobal = window["webpack5"]=[];
  //然后重写的window["webpack5"].push=webpackJsonpCallback
  chunkLoadingGlobal.push = webpackJsonpCallback;
  //异步加载hello代码块，然后把hello代码块里的模块定义合并到主模块定义里去
  //再去加载这个hello.js这个模块，拿 到模 块的导出结果
  //1.准备加载异步代码块hello
  require.e("hello").then(require.bind(require, "./src/hello.js")).then(result => {
    console.log(result.default);
  })
})();