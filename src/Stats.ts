import type { Chunk } from './Chunk'
import type { Compilation } from './Compilation'

export class Stats {
  entries: any[]
  modules: any[]
  chunks: Chunk[]
  files: string[]
  constructor(compilation: Compilation) {
    this.entries = compilation.entries // 入口
    this.modules = compilation.modules // 模块
    this.chunks = compilation.chunks // 代码块
    this.files = compilation.files // 文件名数组
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
