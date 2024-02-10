import type { Compiler } from '../Compiler'
import { SingleEntryPlugin } from './SingleEntryPlugin'

function itemToPlugin(context, item, name) {
  return new SingleEntryPlugin(context, item, name)
}

export class EntryOptionPlugin {
  constructor() {}
  apply(compiler: Compiler) {
    compiler.hooks.entryOption.tap('EntryOptionPlugin', (context, entry) => {
      // 1. 单入口
      itemToPlugin(context, entry, 'main').apply(compiler)
      // TODO：2. 多入口
    })
  }
}
