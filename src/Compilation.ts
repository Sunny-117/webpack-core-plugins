import path from 'node:path'
import { SyncHook, Tapable } from 'tapable'
import async from 'neo-async'
import type { Compiler } from './Compiler'
import { NormalModuleFactory } from './plugins/NormalModuleFactory'
import { Parser } from './Parser'
import type { NormalModule } from './plugins/NormalModule'
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
  hooks: {
    // trigger when a module had been built
    succeedModule: any
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
}
