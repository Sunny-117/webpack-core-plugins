// 语法降级
// const sum = (a, v)=>a+v
// console.log(sum(1, 2))

// polyfill

// const p = new Promise((resolve)=>{
//     resolve('ok')
// })
// console.log(p)
import './index.css'
import("./utils.js").then(r=>{
    console.log(r)
})