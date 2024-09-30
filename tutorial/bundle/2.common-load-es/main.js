(() => {
  const modules = {
    // 总结一下，如果原来是es module 如何变成commonjs
    // export default会变成exports.default
    // export xx exports.xx
    './src/title.js': (module, exports, require) => {
      // 不管是commonjs还是es module最后都编译成common.js,如果原来是es module的话，
      // 就把exports传给r方法处理一下，exports.__esModule=true ，以后就可以通过这个属性来判断原来是不是一个es module
      require.r(exports)
      require.d(exports, {
        default: () => DEFAULT_EXPORT,
        age: () => age,
      })
      const DEFAULT_EXPORT = 'title_name'
      const age = 'title_age'
    },
  }
  const cache = {}
  function require(moduleId) {
    if (cache[moduleId]) { // 先看缓存里有没有已经缓存的模块对象
      return cache[moduleId].exports// 如果有就直接返回
    }
    // module.exports默认值 就是一个空对象
    const module = { exports: {} }
    cache[moduleId] = module
    // 会在模块的代码执行时候给module.exports赋值
    modules[moduleId].call(module.exports, module, module.exports, require)
    return module.exports
  }
  require.d = (exports, definition) => {
    for (const key in definition) {
      // exports[key]=definition[key]();
      Object.defineProperty(exports, key, { enumerable: true, get: definition[key] })
    }
  }
  require.r = (exports) => {
    // console.log(Object.prototype.toString.call(exports));//[object Module]
    // exports.__esModule=true
    Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' }) // 给一个标识 代表esm
    Object.defineProperty(exports, '__esModule', { value: true })
  }
  // ./src/index.js 的代码
  (() => {
    const title = require('./src/title.js')
    console.log(title)
    console.log(title.age)
  })()
})()
