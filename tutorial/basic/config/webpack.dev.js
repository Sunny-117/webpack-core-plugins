const { merge } = require('webpack-merge');
const base = require('./webpack.base');
const devConfig = {
    mode:'development',
    module:{
        rules:[
            {
                test:/\.css$/
            }
        ]
    }
};
module.exports = merge(base,devConfig);
// module.exports = {...base,...devConfig};
console.log(JSON.stringify(module.exports));