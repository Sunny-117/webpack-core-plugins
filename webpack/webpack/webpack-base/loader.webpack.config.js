module.exports = {
    mode: "development",
    module: {
        // rules: [{
        //     test: /index\.js$/, // 正则表达式 匹配模块路径
        //     use: [{
        //         loader: "./loaders/my-test-loader.js", //加载器的路径
        //         options: {
        //             changeVar: '未知数'
        //         }
        //     }]
        // }, // 从后往前看
        // ],
        // // 模块匹配的规则
        // noParse://是否不要解析某个模块
        rules: [{
            // 简化板
            test: /index\.js$/, //正则表达式，匹配模块的路径
            use: ["./loaders/loader1", "./loaders/loader2"] //匹配到了之后，使用哪些加载器
        }, //规则1
        {
            test: /\.js$/, //正则表达式，匹配模块的路径
            use: ["./loaders/loader3", "./loaders/loader4"] //匹配到了之后，使用哪些加载器
        } //规则2
        ],
    }
}

// 匹配是正着匹配，但是运行是反着运行
// [loader1,loader2,loader3,loader4]

// 加上a.js后的运行顺序： 432143。因为根据整个过程，当处理a模块时候，a只能匹配到第二个，所以运行43

// loader在node环境中运行，不能使用es6 module。loader是在打包过程中用到的，打包过程是在node环境