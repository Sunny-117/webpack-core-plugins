import './layout.css';

/**
 * React
 */
import React from 'react';
import ReactDOM from 'react-dom';

const a = 1;
const b = 2;
/**
 * Babel
 */
const sum = (a, b) => a + b;
console.log(sum(a, b));
function App() {
    return (
        <span>React</span>
    );
}

ReactDOM.render((
    <h1>
    hello<App />
    </h1>), document.getElementById('root'));

/**
 * 装饰器
 */
function readonly(target, key, descriptor) {
    console.log({ target, key, descriptor }, 'readonly');
    descriptor.writable = false;
}
class Person {
    @readonly PI = 3.14;
}
const p = new Person();
// p.PI = 3.15;
console.log(p);

/**
 * polyfill
 */
// 全量加载 不推荐 require('@babel/polyfill')
const pro = new Promise((r) => {
    r(1);
});
pro.then((d) => console.log(d));

/**
 * 第三方库
 */
import _ from 'lodash'
alert(_.join("a", "b", "c"))