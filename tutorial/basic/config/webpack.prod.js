const { merge } = require('webpack-merge');
const base = require('./webpack.base');
const prodConfig = {
    mode:'production',
    module:{
        rules:[
            {
                test:/\.css$/
            }
        ]
    }
};
module.exports = merge(base,prodConfig)
//module.exports = {...base,...prodConfig};
/* Object.assign();
{...base,mode:'production'} */
console.log(JSON.stringify(module.exports));