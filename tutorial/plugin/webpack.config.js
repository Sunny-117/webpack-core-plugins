
let HtmlWebpackPlugin = require('html-webpack-plugin');
let AutoExternalPlugin = require('./plugins/AutoExternalPlugin');
module.exports = {
    mode:'development',
    entry:'./src/index.js',
    devtool:false,
/*     externals:{
        'jquery':'$',
        'lodash':"_"
    }, */
    plugins:[
        /* new HtmlWebpackPlugin({
            template:'./src/index.html',
            filename:'index.html'
        }), */
        new AutoExternalPlugin({
            jquery:{
                expose:'$',
                url:'https://cdn.bootcss.com/jquery/3.1.0/jquery.js'
            },
            lodash:{
                expose:'_',
                url:'https://cdn.bootcss.com/lodash/3.1.0/lodash.js'
            }
        })
    ]
}