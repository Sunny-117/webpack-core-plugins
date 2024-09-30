/**
 * hash 每次构建会生成一个统一的hash值
 * chunkHash 代码块hash,每个代码块共享 一个hash值
 *  是通过属于这个chunk的所有的模块计算出来的
 * contentHash 内容hash,根据文件的内容生成的hash
 */
let entry = {
    entry1:'entry1',
    entry2:'entry2'
}
let page1 = 'require title1';//模块
let page2 = 'require title2';//模块

let title1 = 'title1';//模块
let title2 = 'title2';//模块

let crypto = require('crypto');


let title1ContentHash = crypto.createHash('md5').update(title1).digest('hex');
console.log('title1ContentHash',title1ContentHash);
let title2ContentHash = crypto.createHash('md5').update(title2).digest('hex');
console.log('title2ContentHash',title2ContentHash);

let page1ContentHash = crypto.createHash('md5').update(page1).digest('hex');
console.log('page1ContentHash',page1ContentHash);
let page2ContentHash = crypto.createHash('md5').update(page2).digest('hex');
console.log('page2ContentHash',page2ContentHash);

let page1ChunkHash = crypto.createHash('md5').update(page1).update(title1).digest('hex');;
console.log(page1ChunkHash);
let page2ChunkHash = crypto.createHash('md5').update(page2).update(title2).digest('hex');;
console.log(page2ChunkHash);

let hash =  crypto.createHash('md5')
.update(page1)
.update(title1)
.update(page2)
.update(title2)
.digest('hex');
console.log('hash',hash)

///变化从快到慢分别是hash>chunkhash>contenthash

///一个代码块可能会产出多个asset(文件)

/**
 * 一个代码块可产出多个文件 main main.js main.css
 * 可是chunk里面那么多文件，
 * 到底取那个文件的contenthash来作为最终生成的assets文件名呢？
 * assets和文件是一对一的
 * main代码块会产出二个assets main.js main.css
 * main.js main.css会生成二个文件
 * 
 * 影响范围越来越小，项目-模块-单个文件
 * 本次编译->代码块(入口)->单个文件
 * 
 * hash chunkhash contenthash
 * assets就是asset的集合
 * 文件的数组 一个文件
 * **/



