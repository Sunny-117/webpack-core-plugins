// 出现import，会变成单独的代码块 成为新的入口(天然的代码分割点)
import(/* webpackChunkName: "helloCustomName" */'./hello').then(r=>{
  console.log(r.default)
})
