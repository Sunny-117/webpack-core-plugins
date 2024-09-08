var hotEmitter = require('../../webpack/hot/emitter');
hotEmitter.on('webpackHotUpdate',(currentHash)=>{
  console.log('dev-server收到了最新的hash值',currentHash);
  //进行真正的热更新检查
  //hotCheck();
});