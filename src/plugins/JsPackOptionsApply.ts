import type { Compiler } from '../Compiler'
import type { JsPackOptions } from '..'
import { EntryOptionPlugin } from './EntryOptionPlugin'

/**
 * mount inner plugins
 */
export class JsPackOptionsApply {
  constructor() {}
  process(options: JsPackOptions, compiler: Compiler) {
    new EntryOptionPlugin().apply(compiler)
    compiler.hooks.entryOption.call(options.context, options.entry)
  }
}
