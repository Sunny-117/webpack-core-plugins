function A() { //Promise新的api babel不会进行转换
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(3);
        }, 1000);
    })
}

async function B() {
    const b = await A();
    const c = await A();
    return b + c;
}
// 会转换：但是yield也是新语法
// function* B() {
//     const b = yield A;
//     const c = yield A();
//     return b + c;
// }
// 继续转换

// 为什么使用babel时，如果要转换async,await，需要安装regeneratorRuntime库？

// 因为async await需要转换成生成器，而生成器语法也属于新语法，也需要转换，而转换生成器需要一个库的支持。

// 迭代器+可迭代协议+状态机=>生成器


B().then(data => console.log(data));