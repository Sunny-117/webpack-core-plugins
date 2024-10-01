let AsyncQueue = require('./AsyncQueue');
function processor(item,callback){
    setTimeout(()=>{
        console.log(item);
        callback();
    },3000);
}
function getKey(item){
    return item.key;
}
let queue = new AsyncQueue(
    { name:'createModule', parallelism:3, processor, getKey }
);
queue.add({key:'module1'}, function(err,result){
    console.log(err,result);
});
queue.add({key:'module2'}, function(err,result){
    console.log(err,result);
});
queue.add({key:'module3'}, function(err,result){
    console.log(err,result);
});
queue.add({key:'module4'}, function(err,result){
    console.log(err,result);
});