function normal(source){
    console.log(this.context);// loaderContext
    console.log('inline1');
    return source+'//inline1';
    //let innerCallback = this.async();
    //innerCallback(null,source+'//inline1');
}
//previousRequest+自己+remainingRequest=request
normal.pitch = function(remainingRequest,previousRequest,data){
    console.log('inline1-pitch');
    //console.log(this);//loaderContext
    //return 'inline1-pitch';//第一种方法
    //this.callback(null, 'inline1-pitch');// 第二种是this.callback返回一个值
    //let innerCallback = this.async();// 第三种 innerCallback
    //innerCallback(null, 'inline1-pitch');
}
normal.raw = false;
module.exports = normal;