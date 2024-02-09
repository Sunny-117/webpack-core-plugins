import type { Compiler } from '../Compiler'

export class SingleEntryPlugin {
  context: any
  name: string
  entry: string
  constructor(context, entry, name) {
    this.context = context
    this.entry = entry
    this.name = name
  }

  apply(compiler: Compiler) {
    compiler.hooks.make.tapAsync('SingleEntryPlugin', (compilation, callback) => {
      console.log('SingleEntryPlugin make...')
      const { context, entry, name } = this
      // start to compile from this entry
      compilation.addEntry(context, entry, name, callback)
    })
  }
}
