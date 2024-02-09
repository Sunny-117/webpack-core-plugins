import path from 'node:path'
import { SyncHook, Tapable } from 'tapable'
import type { Compiler } from './Compiler'
import { NormalModuleFactory } from './plugins/NormalModuleFactory'
import { Parser } from './Parser'
import type { JsPackOptions } from '.'

const parser = new Parser() // single instance!! all module is shared

const normalModuleFactory = new NormalModuleFactory() // single instance
export class Compilation extends Tapable {
  compiler: Compiler
  options: JsPackOptions
  context: any
  inputFileSystem: any
  outputFileSystem: any
  entries: any[]
  modules: any[]
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
    const entryModule = normalModuleFactory.create({
      name,
      context,
      rawRequest,
      resource: path.posix.join(context, rawRequest),
      parser,
    })
    this.entries.push(entryModule)
    this.modules.push(entryModule)
    const afterBuild = (err) => {
      return callback(err, entryModule)
    }
    this.buildModule(entryModule, afterBuild)
  }

  buildModule(module, afterBuild) {
    module.build(this, (err) => {
      this.hooks.succeedModule.call(module)
      afterBuild(err)
    })
  }
}
