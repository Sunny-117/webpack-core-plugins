import type { Compilation } from './Compilation'

export class Stats {
  entries: any[]
  modules: any[]
  constructor(compilation: Compilation) {
    this.entries = compilation.entries
    this.modules = compilation.modules
  }

  toJson() {
    return this
    // {
    //   entries: [], // Show all entries
    //   chunks: [], // Show all code blocks
    //   module: [], // Show all module
    //   assets: [], // Show all assets
    // }
  }
}
