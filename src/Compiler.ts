import { AsyncSeriesHook, Tapable } from 'tapable'
import type { JsPackOptions } from '.'

export class Compiler extends Tapable {
  context: any
  hooks: unknown
  options: JsPackOptions

  constructor(context) {
    super()
    this.options = {} as JsPackOptions
    this.context = context
    this.hooks = {
      done: new AsyncSeriesHook(['stats']), // Triggered after compilation is complete

    }
  }

  run(callback) {
    console.log('Compile run')
    callback(null, {
      toJSON: () => ({
        entries: [], // Show all entries
        chunks: [], // Show all code blocks
        module: [], // Show all module
        assets: [], // Show all assets
      }),
    })
  }
}
