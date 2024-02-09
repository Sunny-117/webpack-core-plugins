import type { Compiler } from '../Compiler'
import { SingleEntryPlugin } from './SingleEntryPlugin'

function itemToPlugin(context, item, name) {
  return new SingleEntryPlugin(context, item, name)
}

export class EntryOptionPlugin {
  constructor() {}
  apply(compiler: Compiler) {
    compiler.hooks.entryOption.tap('EntryOptionPlugin', (context, entry) => {
      itemToPlugin(context, entry, 'main').apply(compiler)
    })
  }
}
