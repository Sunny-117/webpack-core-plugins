//let {SyncHook} = require('tapable');
class SyncHook{
    constructor(args){
        this.args = args||[];
        this.taps = [];
    }
    tap(name,fn){
        this.taps.push(fn);
    }
    call(){
        let args = Array.prototype.slice.call(arguments,0,this.args.length);
        this.taps.forEach(tap=>tap(...args));
    }
}
//不同的事件需要创建不同的hook
//优点就是结构会比较清晰
//webpack事件大概有四五百种,有几百个钩子，各干各的监听 和触发，互不干扰
//需要给构建函数传给一个形参数组，它将决定在call的时候要接收多少个参数
let aHook = new SyncHook(['a','age']);
let bHook = new SyncHook(['b','age']);
//tap类似于我们以前学的events库中的 on  监听事件
aHook.tap('这个名字没有什么用，只是给程序员看的',(name,age)=>{
    console.log(name,age,'这是一个回调');
});
aHook.call('Sunny',10);
bHook.tap('这个名字没有什么用，只是给程序员看的',(name,age)=>{
    console.log(name,age,'这是一个回调');
});
bHook.call('Sunny',10);