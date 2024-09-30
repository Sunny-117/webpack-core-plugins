function createHash(){
   return  require('crypto').createHash('md5');
}
let entry = {
    entry1:'entry1',
    entry2:'entry2'
}
let entry1 = 'require depModule1';//模块entry1
let entry2 = 'require depModule2';//模块entry2

let depModule1 = 'depModule1';//模块depModule1
let depModule2 = 'depModule2';//模块depModule2
//如果都使用hash的话，因为这是工程级别的，即每次修改任何一个文件，所有文件名的hash至都将改变。所以一旦修改了任何一个文件，整个项目的文件缓存都将失效
let hash =  createHash()
.update(entry1)
.update(entry2)
.update(depModule1)
.update(depModule2)
.digest('hex');
console.log('hash',hash)
//chunkhash根据不同的入口文件(Entry)进行依赖文件解析、构建对应的chunk，生成对应的哈希值。
//在生产环境里把一些公共库和程序入口文件区分开，单独打包构建，接着我们采用chunkhash的方式生成哈希值，那么只要我们不改动公共库的代码，就可以保证其哈希值不会受影响
let entry1ChunkHash = createHash()
.update(entry1)
.update(depModule1).digest('hex');;
console.log('entry1ChunkHash',entry1ChunkHash);

let entry2ChunkHash = createHash()
.update(entry2)
.update(depModule2).digest('hex');;
console.log('entry2ChunkHash',entry2ChunkHash);

let entry1File = entry1+depModule1;
let entry1ContentHash = createHash()
.update(entry1File).digest('hex');;
console.log('entry1ContentHash',entry1ContentHash);

let entry2File = entry2+depModule2;
let entry2ContentHash = createHash()
.update(entry2File).digest('hex');;
console.log('entry2ContentHash',entry2ContentHash);



