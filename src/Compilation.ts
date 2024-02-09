import path from 'node:path'
import { SyncHook, Tapable } from 'tapable'
import async from 'neo-async'
import type { Compiler } from './Compiler'
import { NormalModuleFactory } from './plugins/NormalModuleFactory'
import { Parser } from './Parser'
import type { NormalModule } from './plugins/NormalModule'
import { Chunk } from './Chunk'
import type { JsPackOptions } from '.'

const parser = new Parser() // single instance!! all module is shared

const normalModuleFactory = new NormalModuleFactory() // single instance

type ModuleId = string
export class Compilation extends Tapable {
  compiler: Compiler
  options: JsPackOptions
  context: any
  inputFileSystem: any
  outputFileSystem: any
  entries: any[]
  modules: any[]
  _modules: Record<ModuleId, object> // {模块id：模块对象}
  chunks: Chunk[] = []
  hooks: {
    // trigger when a module had been built
    succeedModule: any
    seal: any
    beforeChunks: any
    afterChunks: any
  }

  constructor(compiler: Compiler) {
    super()
    this.compiler = compiler
    this.options = compiler.options
    this.context = compiler.context
    this.inputFileSystem = compiler.inputFileSystem
    this.outputFileSystem = compiler.outputFileSystem
    this.entries = []
    this.modules = []
    this._modules = {}
    this.hooks = {
      succeedModule: new SyncHook(['module']),
      seal: new SyncHook(),
      beforeChunks: new SyncHook(),
      afterChunks: new SyncHook(),
    }
  }

  /**
   * start to compile a new entry
   * @param context root dir
   * @param entry the absolute path of entry module './src/index.js'
   * @param name entry name
   * @param callback
   */
  addEntry(context, entry, name, callback) {
    this._addModuleChain(context, entry, name, (err, module) => {
      callback(err, module)
    })
  }

  _addModuleChain(context, rawRequest, name, callback) {
    const resource = path.posix.join(context, rawRequest)
    this.createModule({
      name,
      context,
      rawRequest,
      resource,
      parser,
      moduleId: `./${path.posix.relative(context, resource)}`, // ./src/index.js
    }, entryModule =>
      this.entries.push(entryModule), callback)
  }

  /**
   * process module of deps
   * @param module ./src/index.js
   * @param callback
   */
  processModuleDependences(module: NormalModule, callback) {
    const dependencies = module.dependencies
    // 遍历依赖模块，全部开始编译，当所有的依赖模块全部编译完成后才调用callback
    async.forEach(dependencies, (dependency, done) => {
      const { name, context, rawRequest, resource, moduleId } = dependency
      this.createModule({
        name,
        context,
        rawRequest,
        resource,
        parser,
        moduleId,
      }, null, done)
    }, callback)
  }

  /**
   *
   * @param data Module information to be compiled
   * @param addEntry optional. the method to add entry
   * @param callback
   */
  createModule(data, addEntry, callback) {
    const module = normalModuleFactory.create(data)
    if (module?.moduleId)
      this._modules[module.moduleId] = module

    addEntry && addEntry(module)
    this.entries.push(module)
    this.modules.push(module)
    const afterBuild = (err, module) => {
      if (module.dependencies.length > 0) {
        this.processModuleDependences(module, (err) => {
          callback(err, module)
        })
      }
      else {
        return callback(err, module)
      }
    }
    this.buildModule(module, afterBuild)
  }

  buildModule(module, afterBuild) {
    module.build(this, (err) => {
      this.hooks.succeedModule.call(module)
      afterBuild(err, module)
    })
  }

  /**
   * 把模块封装成代码块 chunk
   * @param callback
   */
  seal(callback) {
    this.hooks.seal.call()
    this.hooks.beforeChunks.call()// 开始准备生成代码块
    // 一般来说，默认情况下，每一个入口会生成一个代码块
    for (const entryModule of this.entries) {
      const chunk = new Chunk(entryModule)// 根据入口模块得到一个代码块
      this.chunks.push(chunk)
      // 对所有模块进行过滤,找出来那些名称跟这个chunk一样的模块,组成一个数组赋给chunk.modules
      chunk.modules = this.modules.filter(module => module.name === chunk.name)
    }
    this.hooks.afterChunks.call(this.chunks)
    callback()
  }
}
