import { jspack } from '@sunny-117/jspack'
import jspackOptions from './jspack.config'

const compiler = jspack(jspackOptions)
compiler.run((err, stats) => {
  console.log(err)
  console.log(stats.toJson())
})
