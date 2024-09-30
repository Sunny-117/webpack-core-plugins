
class Person{
    name='sunny'
}
//loose=true是宽松模式
let p = new Person();
p.name = 'sunny';

//loose =false 严格模式
let p = new Person();
Object.defineProperty(p,'name',{
    value:'sunny',
    writable:true,
    enumerable:true,
    configurable:true
})
//Array.from;
//polyfill 原生Array.prototype加个属性 项目里用的话，你不用担心 你把别人覆盖了
//runtime 库的话 lodash jquery 里面，
