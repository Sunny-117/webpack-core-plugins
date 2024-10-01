const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
module.exports = {
    mode:'production',
    devtool:false,
    entry:{
        main:'./src/index.js'
    },
    //你要编译的目标环境
    //target:["es6","web"],
    optimization:{
        usedExports:true
       // moduleIds:'deterministic',
       // chunkIds:'deterministic'
    },
    resolve:{
        fallback:{
            /* 'crypto':require.resolve('crypto-browserify'),
            "stream": require.resolve("stream-browserify"),
            "buffer": require.resolve("buffer") */
            "crypto":false,
            "stream":false,
            "buffer":false,
        }
    },
    //watch:true,//以监听模式启动
   /*  cache:{
        type:'memory',
        cacheDirectory:path.resolve(__dirname,'node_modules/.cache/webpack'),
        此目录下的文件是永远不变的，只计算第一次就可以了，以后就可以忽略
        immutablePaths:[path.resolve(__dirname,'node_modules')],
        包管理目录，只要计算包名和版本号的信息
        managedPaths:[path.resolve(__dirname,'node_modules')]
    }, */
    output:{
        filename:'[name].js'
    },
    experiments:{//启动一些试验性的特性
        asset:true
    },
    module:{
        rules:[
            {
                test:/\.css/,
                use:[
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test:/\.js/,
                use:[
                    {
                        loader:'babel-loader',
                        options:{
                            presets:['@babel/preset-env']
                        }
                    }
                ]
            },
            {
                test:/\.(png)/,//url-loader
                type:'asset/resource'
            }
            /* {
                test:/\.(jpg)/,//file-loader
                type:'asset/resource'
            },
           
            {
                test:/\.(txt)/,//raw-loader
                type:'asset/source'
            },
            {
                test:/\.(bmp)/,//url-loader+file-loader
                type:'asset'
            } */
        ]
    },
    plugins:[
        new HtmlWebpackPlugin({
            template:'./public/index.html'
        }),
        //new webpack.experiments.schemes.HttpsUriPlugin()
    ]
}