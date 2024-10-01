
let render = ()=>{
    let title = require('./title.js');
    document.getElementById('root').innerText = title;
}
render();
if(module.hot){
    //当title.js模块发生修改的时候，执行render方法这个回调函数
    module.hot.accept(["./title.js"],render);
}