let path = require('path');
let fs = require('fs');
let { runLoaders } = require("./loader-runner") ;
let filePath = path.resolve(__dirname,'src','index.js');
let request = `inline-loader1!inline-loader2!${filePath}`;
let parts = request
.replace(/^-?!+/,'')
.split('!');
let resource = parts.pop();//最后一个元素就是要加载的资源了
let resolveLoader = (loader)=>path.resolve(__dirname,'loaders2',loader);
let inlineLoaders = parts.map(resolveLoader);
let rules = [
    {
        test:/\.js$/,
        use:['normal-loader1','normal-loader2']
    },
    {
        test:/\.js$/,
        enforce:'post',//post webpack保证一定是后执行的
        use:['post-loader1','post-loader2']
    },
    {
        test:/\.js$/,
        enforce:'pre',//一定先执行eslint
        use:['pre-loader1','pre-loader2']
    },
];
let preLoaders = [];
let postLoaders = [];
let normalLoaders = [];
for(let i=0;i<rules.length;i++){
    let rule = rules[i]
    if(rule.test.test(resource)){
       if(rule.enforce=='pre'){
         preLoaders.push(...rule.use);
       }else if(rule.enforce=='post'){
        postLoaders.push(...rule.use);
       }else{
        normalLoaders.push(...rule.use);
       }
    }
}
preLoaders = preLoaders.map(resolveLoader);
postLoaders = postLoaders.map(resolveLoader);
normalLoaders = normalLoaders.map(resolveLoader);
let loaders = [];
if(request.startsWith('!!')){//noPrePostAutoLoaders
    loaders=[,...inlineLoaders];
}else if(request.startsWith('-!')){//noPreAutoLoaders
    loaders=[...postLoaders,...inlineLoaders];
}else if(request.startsWith('!')){//不要普通 loader
    loaders=[...postLoaders,...inlineLoaders,...preLoaders];
}else{
  loaders=[...postLoaders,...inlineLoaders,...normalLoaders,...preLoaders];
}
console.log(loaders);
debugger
runLoaders({
    resource,
    loaders,
    context: {name:'Sunny'},
	readResource: fs.readFile.bind(fs)
}, function(err, result) {
    console.log(err);
    console.log(result.result,result.resourceBuffer.toString());
})
