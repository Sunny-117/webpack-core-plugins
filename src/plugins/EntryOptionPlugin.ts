import type { Compiler } from '../Compiler'
import { SingleEntryPlugin } from './SingleEntryPlugin'

function itemToPlugin(context, item, name) {
  return new SingleEntryPlugin(context, item, name)
}

export class EntryOptionPlugin {
  constructor() {}
  apply(compiler: Compiler) {
    compiler.hooks.entryOption.tap('EntryOptionPlugin', (context, entry) => {
      if (typeof entry === 'string') {
        // 1. 单入口
        itemToPlugin(context, entry, 'main').apply(compiler)
      }
      else {
        // TODO：2. 多入口
        for (const entryName in entry)
          itemToPlugin(context, entry[entryName], entryName).apply(compiler)
      }
    })
  }
}
