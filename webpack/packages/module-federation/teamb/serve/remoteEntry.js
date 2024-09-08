window.teamb = (() => {
    var modules = {
        "webpack/container/entry/teamb": (module, exports, require) => {
            var moduleMap = {
                './Dropdown': () => {
                    return Promise.all(
                        [require.e("webpack_sharing_consume_default_is-array_is-array"),
                        require.e("src_Dropdown_js")])
                        .then(() => () => require("./src/Dropdown.js"));
                },
                './Button': () => {
                    return Promise.all(
                        [require.e("webpack_sharing_consume_default_is-array_is-array"),
                        require.e("src_Button_js")])
                        .then(() => () => require("./src/Button.js"));
                },
            }
            var get = (name) => {
                return moduleMap[name]();
            }
            var init = (shareScope) => {
                var name = 'default';
                require.S[name] = shareScope;
                return require.I(name);
            }
            require.d(exports, {
                get: () => get,//获取模块定义 
                init: () => init //初始化
            });
        }
    }
    var cache = {};
    function require(moduleId) {
        if (cache[moduleId]) {
            return cache[moduleId].exports;
        }
        var module = cache[moduleId] = {
            exports: {}
        };
        modules[moduleId](module, module.exports, require);
        return module.exports;
    }
    //返回一个getter,然后 getter()获取 到默认导出
    require.n = (module) => {
        var getter = module && module.__esModule ?
            () => module['default'] :
            () => module;
        return getter;
    };
    require.d = (exports, definition) => {
        for (var key in definition) {
            Object.defineProperty(exports, key, { get: definition[key] });
        }
    }
    require.f = {};
    require.e = (chunkId) => {
        let promises = [];
        for (var key in require.f) {
            require.f[key](chunkId, promises);
        }
        return Promise.all(promises);
    }
    //scope范围 作用域 执行环境
    //default
    //从共享使用域中加载共享模块
    require.S = {};
    require.I = name => {
        //require.S就是所有的作用域的集合, name来区分
        if (require.S[name]) {
            return Promise.resolve();
        }
    }
    var init = fn => function (scopeName, key, version) {
        return require.I(scopeName).then(() => {
            return fn(require.S[scopeName], key, version);
        });
    }
    //scope = {'is-array':{1.0.1':()=>({get():对应的就是isArray模块内容})}} key=is-array version=1.0.1
    var loadShareScope = init((scope, key, version) => {
        var versions = scope[key];
        var entry = versions[version];
        return entry.get();
    });
    (() => {
        var moduleToHandlerMapping = {
            "webpack/sharing/consume/default/is-array/is-array":
                () => loadShareScope('default', 'is-array', '1.0.1')
        };
        var chunkMapping = {
            "webpack_sharing_consume_default_is-array_is-array": [
                "webpack/sharing/consume/default/is-array/is-array"
            ]
        };
        require.f.consumes = (chunkId, promises) => {
            if (require.o(chunkMapping, chunkId)) {
                chunkMapping[chunkId].forEach(id => {
                    let promise = moduleToHandlerMapping[id]().then(factory => {
                        modules[id] = () => {
                            module.exports = factory();//工厂的执行结果就是那个这个ID对应的模块定义了
                        }
                    });
                    promises.push(promise);
                });
            }
        }

    })();
    require.p = "http://localhost:8080/";
    require.u = (chunkId) => {
        return "" + chunkId + ".js";
    };
    require.l = (url, done) => {
        var script = document.createElement('script');
        script.src = url;
        script.onload = done
        document.head.appendChild(script);
    };
    require.r = (exports) => {
        Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
        Object.defineProperty(exports, '__esModule', { value: true });
    };
    var installedChunks = {
        "teamb": 0
    };
    require.f.j = (chunkId, promises) => {
        if ("webpack_sharing_consume_default_is-array_is-array" != chunkId) {
            var promise = new Promise((resolve, reject) => {
                installedChunks[chunkId] = [resolve, reject];
            });
            promises.push(promise);
            var url = require.p + require.u(chunkId);
            require.l(url);
        }
    };
    require.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);
    var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
        var [chunkIds, moreModules] = data;
        var moduleId, chunkId, i = 0, resolves = [];
        for (; i < chunkIds.length; i++) {
            chunkId = chunkIds[i];
            if (require.o(installedChunks, chunkId) && installedChunks[chunkId]) {
                resolves.push(installedChunks[chunkId][0]);
            }
            installedChunks[chunkId] = 0;
        }
        for (moduleId in moreModules) {
            if (require.o(moreModules, moduleId)) {
                modules[moduleId] = moreModules[moduleId];
            }
        }
        if (parentChunkLoadingFunction) parentChunkLoadingFunction(data);
        while (resolves.length) {
            resolves.shift()();
        }
    }
    var chunkLoadingGlobal = self["webpackChunkteamb"] = self["webpackChunkteamb"] || [];
    chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
    chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
    return require("webpack/container/entry/teamb");
})();