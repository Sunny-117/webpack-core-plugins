import { jspack } from '@sunny-117/jspack'
import jspackOptions from './jspack.config.js'

const compiler = jspack(jspackOptions)
compiler.run((err, stats) => {
  console.log(err)
  console.log(stats.toJSON())
})
