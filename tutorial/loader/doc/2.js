let fs = require('fs');

fs.readFile('./1.txt',(err,data)=>{
    console.log(data);
});
/**
我觉着回调就是同步代码  
过程中有异步不就是异步了 
普通的回调，不是宏任务和微任务的回调。 
*/
//这是同步的
//回调有可能被同步调用，也有可能被异步调用
function fn(callback){
    callback();
    setTimeout(callback,1000);
}

fn(()=>{
    console.log('x');
});
