let extensions = ['','.ts','.jsx','.json'];
//那加了posix，在window平台还能执行吗  能
//modulePath 是啥
let modulePath = 'C:/aproject/webpack/5.flow/src/title';
let fs = require('fs');
function tryPath(modulePath,originalModulePath,moduleContext){
    for(let i=0;i<extensions.length;i++){
       if(fs.existsSync(modulePath+extensions[i])){
        return modulePath+extensions[i];
       }
    }
    throw new Error(`Module not found: Error: Can't resolve '${originalModulePath}' in '${moduleContext}'`);
}
tryPath(modulePath,'./title','C:/aproject/webpack/5.flow/src');

/* let exist = fs.existsSync(modulePath);
console.log(exist);
let exist2 = fs.existsSync(modulePath+'.js');
console.log(exist2); 
*/
/* let exist=false;
let index = 0;
do{
    exist = fs.existsSync(modulePath+extensions[index++]);
}while(!exist);
modulePath=modulePath+extensions[--index];
console.log(modulePath); */

