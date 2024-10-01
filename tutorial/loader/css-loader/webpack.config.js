const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    mode:'development',
    devtool:false,
    resolve:{
       alias:{
        '@':path.resolve(__dirname,'src') 
       }
    },
    resolveLoader:{
        alias:{
           // 'css-loader':path.resolve(__dirname,'loaders','css-loader.js'),
           // 'less-loader':path.resolve(__dirname,'loaders','less-loader.js')
        },
        modules:[path.resolve(__dirname,'loaders'),'node_modules']
    },
    module:{
        rules:[
            {
                test:/\.css$/,
                use:[
                    "style-loader",
                    {
                        loader:'css-loader',
                        options:{
                            url:true,//是否解析url()
                            import:true,//是否解析@import语法
                            esModule: false,//不包装成ES MODULE，默认是common.js导出
                            //importLoaders:0//在处理导入的CSS的时候，要经过几个前置loader的处理
                        }
                    },
                    //"logger2-loader",
                    //"logger1-loader",
                ],
                include:path.resolve('src')
            },
            {
                test:/\.less$/,
                use:[
                    "style-loader",
                    {
                        loader:'css-loader',
                        options:{
                            url:false,//是否解析url()
                            import:true,//是否解析@import语法
                            esModule: false,//不包装成ES MODULE，默认是common.js导出
                            importLoaders:0//在处理导入的CSS的时候，要经过几个前置loader的处理
                        }
                    },
                    'less-loader'
                ],
                include:path.resolve('src')
            },
            {
                test:/\.(jpg|png|gif)/,
                use:[
                    {
                        loader:"file-loader",
                        options:{
                            esModule: false
                        }
                    }
                ]
            }
        ]
    },
    plugins:[
        new HtmlWebpackPlugin({template:'./src/index.html'}),
    ]
}