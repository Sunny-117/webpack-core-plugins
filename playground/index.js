import { jspack } from '@sunny-117/jspack'

import jspackOptions from './jspack.config.js'

// import jspackOptions from './jspack.loader.js'

const compiler = jspack(jspackOptions)
compiler.run((err, stats) => {
  console.log(err, stats.toJson())
})
