export class Chunk {
  entryModule: unknown
  async: unknown
  name: unknown
  files: unknown[]
  modules: unknown[]
  constructor(entryModule) {
    this.entryModule = entryModule// 此代码的入口模块
    this.async = entryModule.async
    this.name = entryModule.name// 代码块的名称 main
    this.files = []// 这个代码生成了哪些文件
    this.modules = []// 这个代码块包含哪些模块
  }
}
