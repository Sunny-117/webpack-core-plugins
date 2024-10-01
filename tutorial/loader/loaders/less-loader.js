
/**
 * 把LESS编译成CSS字符串
 * @param {*} content 
 */
let less = require('less');
function loader(content){
    //我们通过调用this.async方法可以返回一个函数，它会把loader的执行变成异步的,不会直接往下执行了
    //默认情况下loader执行是同步的
    console.log('this.resource',this.resource);
    //this.callback===callback  后面讲实现
    let callback = this.async();
    less.render(content,{filename:this.resource},(err,output)=>{
        //会让loader继续往下执行
        callback(err,output.css);
    });
}
module.exports = loader;
/**
 * css-loader不用吗 先不用
 * css-loader的作用是处理css中的@import 和 url(./images/logo.png)
   less.render干啥的 把LESS内容 转译成CSS内容　
   感觉不出这里异步的必要性 
   这个异步是宏任务还是微任务？ ???


 */