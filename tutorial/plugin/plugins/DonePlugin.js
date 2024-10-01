
class DonePlugin{
  apply(compiler){
      debugger
    compiler.hooks.done.tapAsync('DonePlugin',(stats,callback)=>{
        console.log('DonePlugin');
        callback();
    });
  }
}
module.exports = DonePlugin;