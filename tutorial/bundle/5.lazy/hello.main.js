// 5.执行window["webpack5"]上的push方法,传递参数[chunkIds,moreModules]
(window.webpack5 = window.webpack5 || []).push([['hello'], {
  './src/hello.js':
    (module, exports, require) => {
      require.r(exports)
      require.d(exports, {
        default: () => __WEBPACK_DEFAULT_EXPORT__,
      })
      const __WEBPACK_DEFAULT_EXPORT__ = ('hello ')
    },
}])
