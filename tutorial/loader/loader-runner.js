let fs = require('fs');
let path = require('path');
let readFile = fs.readFile.bind(this);//读取硬盘上文件的默认方法
function createLoaderObject(request){
    let loaderObj = {
        request,
        normal:null,//loader函数本身
        pitch:null,//pitch函数本身
        raw:false,//是否需要转成字符串,默认是转的
        data:{},//每个loader都会有一个自定义的data对象，用来存放一些自定义信息
        pitchExecuted:false,//pitch函数是否已经执行过了
        normalExecuted:false//normal函数是否已经执行过了
    }
    let normal = require(loaderObj.request);
    loaderObj.normal = normal;
    loaderObj.raw = normal.raw;
    let pitch = normal.pitch;
    loaderObj.pitch = pitch;
    return loaderObj;
}
function processResource(processOptions,loaderContext,finalCallback){
    loaderContext.loaderIndex = loaderContext.loaderIndex-1;//索引等最后一个loader的索引
    let resource = loaderContext.resource;//c:/src/index.js
    loaderContext.readResource(resource,(err,resourceBuffer)=>{
        if(err)finalCallback(err);
        processOptions.resourceBuffer= resourceBuffer;//放的是资源的原始内容
        iterateNormalLoaders(processOptions,loaderContext,[resourceBuffer],finalCallback);
    });
}
function iterateNormalLoaders(processOptions,loaderContext,args,finalCallback){
    if(loaderContext.loaderIndex<0){// 如果索引已经小于0了，就表示所有的normal执行完成了
        return finalCallback(null,args);
    }
    let currentLoaderObject = loaderContext.loaders[loaderContext.loaderIndex];
   if(currentLoaderObject.normalExecuted){
    loaderContext.loaderIndex--;
    return iterateNormalLoaders(processOptions,loaderContext,args,finalCallback);
   }
   let normalFunction = currentLoaderObject.normal;
   currentLoaderObject.normalExecuted =true;//表示pitch函数已经执行过了
   convertArgs(args,currentLoaderObject.raw);
   runSyncOrAsync(normalFunction,loaderContext,args,(err,...values)=>{
    if(err)finalCallback(err);
    iterateNormalLoaders(processOptions,loaderContext,values,finalCallback);
   });
}
function convertArgs(args,raw){
    if(raw&&!Buffer.isBuffer(args[0])){//想要Buffer,但不是Buffer,转成Buffer
        args[0]= Buffer.from(args[0]);
    }else if(!raw&&Buffer.isBuffer(args[0])){//想要Buffer,但不是Buffer,转成Buffer
        args[0]=args[0].toString('utf8');
    }
}
function iteratePitchingLoaders(processOptions,loaderContext,finalCallback){
    if(loaderContext.loaderIndex>=loaderContext.loaders.length){
        return processResource(processOptions,loaderContext,finalCallback);
    }
   let currentLoaderObject = loaderContext.loaders[loaderContext.loaderIndex];
   if(currentLoaderObject.pitchExecuted){
    loaderContext.loaderIndex++;
    return iteratePitchingLoaders(processOptions,loaderContext,finalCallback);
   }
   let pitchFunction = currentLoaderObject.pitch;
   currentLoaderObject.pitchExecuted =true;//表示pitch函数已经执行过了
   if(!pitchFunction)//如果此loader没有提供pitch方法
     return iteratePitchingLoaders(processOptions,loaderContext,finalCallback);
   runSyncOrAsync(pitchFunction,loaderContext,
    [loaderContext.remainingRequest,loaderContext.previousRequest,loaderContext.data]
    ,(err,...values)=>{
        if(values.length>0 && !!values[0]){
            loaderContext.loaderIndex--;//索引减1，回到上一个loader,执行上一个loader的normal方法
            iterateNormalLoaders(processOptions,loaderContext,values,finalCallback);
        }else{
            iteratePitchingLoaders(processOptions,loaderContext,finalCallback);
        }
   });
}
function runSyncOrAsync(fn,context,args,callback){
  let isSync = true;//是否同步，默认是的
  let isDone = false;//是否fn已经执行完成,默认是false
  const innerCallback = context.callback = function(err,...values){
        isDone= true;
        isSync = false;
        callback(err,...values);
  }
  context.async = function(){
    isSync=false;//把同步标志设置为false,意思就是改为异步
    return innerCallback;
  }
  let result = fn.apply(context,args);
  if(isSync){
    isDone =true;//直接完成
    return callback(null,result);//调用回调
  }
}
function runLoaders(options,callback){
    let resource = options.resource || '';//要加载的资源 c:/src/index.js?name=Sunny#top
    let loaders = options.loaders || [];//loader绝对路径的数组
    let loaderContext = options.context||{};//这个是一个对象，它将会成为loader函数执行时候的上下文对象this
    let readResource = options.readResource||readFile;
    let loaderObjects = loaders.map(createLoaderObject);
    loaderContext.resource=resource;
    loaderContext.readResource = readResource;
    loaderContext.loaderIndex = 0;//它是一个指标，就是通过修改它来控制当前在执行哪个loader
    loaderContext.loaders = loaderObjects;//存放着所有的loaders
    loaderContext.callback = null;
    loaderContext.async = null;//它是一个函数，可以把loader的执行从同步改为异步
    Object.defineProperty(loaderContext,'request',{
        get(){
            return loaderContext.loaders.map(l=>l.request).concat(loaderContext.resource).join('!')
        }
    });
    Object.defineProperty(loaderContext,'remainingRequest',{
        get(){
            return loaderContext.loaders.slice(loaderContext.loaderIndex+1).concat(loaderContext.resource).join('!')
        }
    });
    Object.defineProperty(loaderContext,'currentRequest',{
        get(){
            return loaderContext.loaders.slice(loaderContext.loaderIndex).concat(loaderContext.resource).join('!')
        }
    });
    Object.defineProperty(loaderContext,'previousRequest',{
        get(){
            return loaderContext.loaders.slice(0,loaderContext.loaderIndex).join('!')
        }
    });
    Object.defineProperty(loaderContext,'data',{
        get(){
            let loaderObj = loaderContext.loaders[loaderContext.loaderIndex];
            return loaderObj.data;
        }
    });
    let processOptions = {
        resourceBuffer:null
    }
    iteratePitchingLoaders(processOptions,loaderContext,(err,result)=>{
        callback(err,{
            result,
            resourceBuffer:processOptions.resourceBuffer
        });
    });
}
exports.runLoaders = runLoaders;
