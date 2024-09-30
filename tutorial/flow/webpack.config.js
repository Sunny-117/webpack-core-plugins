const path = require('path');
const Run1Plugin = require('./plugins/run1-plugin')
const Run2Plugin = require('./plugins/run2-plugin')
const Run3Plugin = require('./plugins/run3-plugin')
const DonePlugin = require('./plugins/done-plugin')
const READMEPlugin = require('./plugins/readme-plugin')
module.exports = {
    mode:'development',
    devtool:'inline-source-map',
    //C:\aproject\webpack\5.flow
    context:process.cwd(),//根目录 current working directory
    entry:{
        page1:'./src/page1.js',
        page2:'./src/page2.js'
    },
    output:{
        path:path.resolve(__dirname,'dist'),
        filename:'[name].js'
    },
    resolve:{
        extensions:['.js','.jsx','.json']
    },
    module:{
        rules:[
            {
                test:/\.js$/,
                use:[
                    path.resolve(__dirname,'loaders','logger1-loader.js'),
                    path.resolve(__dirname,'loaders','logger2-loader.js'),
                ]
            }
        ]
    },
    plugins:[
        new Run1Plugin(),
        new DonePlugin(),  
        new READMEPlugin()
    ]
}