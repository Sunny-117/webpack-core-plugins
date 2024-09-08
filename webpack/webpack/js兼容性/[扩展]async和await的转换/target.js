"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, arg) {
    try {
        var info = gen.next(arg);
        var value = info.value;
    } catch (error) { //如果有错误
        reject(error);
        return;
    }
    if (info.done) { //完成
        resolve(value);
    } else { //没完成
        Promise.resolve(value).then(data => {
            _next(data);
        });
    }
}


function A() {
    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve(3);
        }, 1000);
    });
}

function B() {
    var fn = function* () {
        // 无非是转换生成器，这里很复杂，就直接写生成器了
        const b = yield A();
        const c = yield A();
        return b + c;
    };
    return new Promise(function (resolve, reject) {
        var gen = fn(); //得到一个生成器

        function _next(value) {
            asyncGeneratorStep(gen, resolve, reject, _next, value);
        }
        _next(undefined);
    });
}

B().then(function (data) {
    return console.log(data);
});