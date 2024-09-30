(()=>{
  var modules = {
    //总结一下，如果原来是es module 如何变成commonjs
    //export default会变成exports.default
    //export xx exports.xx
    "./src/index.js":
      ((module,exports,require) => {
        require.r(exports);//先表示这是一个es module
        var title = require("./src/title.js");
        //这个n有什么用?在这个方我根本不知道title.js是一个es module还是common
        var title_default = require.n(title);
        console.log((title_default()));//默认值
        console.log(title.age);
      }),
    './src/title.js':(module,exports,require)=>{
      module.exports = {
        name: 'title_name',
        age: 'title_age'
      }
    }
  }
  var cache = {};
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
  require.n = (exports)=>{
    var getter = exports.__esModule?()=>exports.default:()=>exports;
    return getter;
  }
  require.d = (exports,definition)=>{
    for(let key in definition){
      //exports[key]=definition[key]();
      Object.defineProperty(exports,key,{enumerable:true,get:definition[key]});
    }
  }
  require.r = (exports)=>{
    //console.log(Object.prototype.toString.call(exports));//[object Module]
    //exports.__esModule=true 
    Object.defineProperty(exports,Symbol.toStringTag,{value:'Module'});
    Object.defineProperty(exports,'__esModule',{value:true});
  }
  //./src/index.js 的代码
  (()=>{
    require("./src/index.js");
  })();
})();