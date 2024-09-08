let render = ()=>{
    let title = require('./title.js');
    document.getElementById('root').innerText = title;
}
render();
if(module.hot){
    //可以接收并处理哪些模块的变更
    module.hot.accept(["./title.js"],render);
}