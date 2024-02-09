import type { Compiler } from '../Compiler'

export class SingleEntryPlugin {
  context: any
  item: any
  name: any
  constructor(context, item, name) {
    this.context = context
    this.item = item
    this.name = name
  }

  apply(compiler: Compiler) {
    compiler.hooks.make.tapAsync('SingleEntryPlugin', (compilation, callback) => {
      console.log('SingleEntryPlugin make...')
      const { context, item, name } = this
      // start to compile from this entry
      // compilation.addEntry(context, entry, name, callback)
    })
  }
}
