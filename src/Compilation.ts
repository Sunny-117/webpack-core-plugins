import path, { dirname } from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import { SyncHook, Tapable } from 'tapable'
import async from 'neo-async'
import ejs from 'ejs'
import type { Compiler } from './Compiler'
import { NormalModuleFactory } from './plugins/NormalModuleFactory'
import { Parser } from './Parser'
import type { NormalModule } from './plugins/NormalModule'
import { Chunk } from './Chunk'
import type { JsPackOptions } from '.'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// 单入口
// const mainTemplate = fs.readFileSync(path.join(__dirname, 'templates', 'asyncMain.ejs'), 'utf8')
// const mainRender = ejs.compile(mainTemplate)
const chunkTemplate = fs.readFileSync(path.join(__dirname, 'templates', 'chunk.ejs'), 'utf8')
const chunkRender = ejs.compile(chunkTemplate)

// 多入口
const mainDeferTemplate = fs.readFileSync(path.join(__dirname, 'templates', 'deferMain.ejs'), 'utf8')
const mainDeferRender = ejs.compile(mainDeferTemplate)

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
  asyncChunkCounter: number | undefined
  chunks: Chunk[] = []
  hooks: {
    // trigger when a module had been built
    succeedModule: any
    seal: any
    beforeChunks: any
    afterChunks: any
  }

  files: string[]
  assets: any
  vendors: any[]
  commons: any[]
  moduleCount: object

  constructor(compiler: Compiler) {
    super()
    this.compiler = compiler
    this.options = compiler.options
    this.context = compiler.context
    this.inputFileSystem = compiler.inputFileSystem
    this.outputFileSystem = compiler.outputFileSystem
    this.entries = []
    this.modules = []
    this._modules = {} // {模块id：模块对象} 防止收集重复
    this.files = []
    this.assets = {} // {filename：文件内容}
    this.vendors = [] // 第三方模块
    this.commons = [] // 同时被多个代码块加载的模块
    this.moduleCount = {}// 可以记录每个模块被代码块引用的次数,如果大于等于2,就分离出到commons里
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
    this._addModuleChain(context, entry, name, false, (err, module) => {
      callback(err, module)
    })
  }

  _addModuleChain(context, rawRequest, name, async, callback) {
    const resource = path.posix.join(context, rawRequest)
    this.createModule({
      name,
      context,
      rawRequest,
      resource,
      parser,
      moduleId: `./${path.posix.relative(context, resource)}`, // ./src/index.js
      async,
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

    addEntry && addEntry(module)
    this.modules.push(module)
    if (module.moduleId)
      this._modules[module.moduleId] = module

    this.entries.push(module)

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
    /**
     * 兼容多入口
     */
    // 循环所有的modules数组
    // ! vendors
    for (const module of this.modules) {
      // 如果模块ID中有node_modules内容,说明是一个第三方模块
      if (/node_modules/.test(module.moduleId)) {
        // TODO：读取配置：optimization.splitChunks.cacheGroups.vendors.name
        module.name = 'vendors'
        // 防止重复收集
        if (!this.vendors.find(item => item.moduleId === module.moduleId))
          this.vendors.push(module)
      }
      else {
        const count = this.moduleCount[module.moduleId]
        if (count) {
          this.moduleCount[module.moduleId].count++
        }
        else {
          // 如果没有,则给它赋初始值 {module,count} count是模块的引用次数
          this.moduleCount[module.moduleId] = { module, count: 1 }
        }
      }
    }
    console.log(this.moduleCount, '--------moduleCount------->')
    // ! common
    for (const moduleId in this.moduleCount) {
      const { module, count } = this.moduleCount[moduleId]
      // TODO: 读取配置optimization.splitChunks.cacheGroups.default.minChunks
      if (count >= 2) {
        module.name = 'commons'
        this.commons.push(module)
      }
    }

    const deferredModuleIds = [...this.vendors, ...this.commons].map(module => module.moduleId)
    this.modules = this.modules.filter(module => !deferredModuleIds.includes(module.moduleId))

    // 一般来说，默认情况下，每一个入口会生成一个代码块
    for (const entryModule of this.entries) {
      const chunk = new Chunk(entryModule)// 根据入口模块得到一个代码块
      this.chunks.push(chunk)
      // 对所有模块进行过滤,找出来那些名称跟这个chunk一样的模块,组成一个数组赋给chunk.modules
      chunk.modules = this.modules.filter(module => module.name === chunk.name)
    }

    if (this.vendors.length > 0) {
      const chunk = new Chunk(this.vendors[0])// 根据入口模块得到一个代码块
      chunk.async = true
      this.chunks.push(chunk)
      // 对所有模块进行过滤,找出来那些名称跟这个chunk一样的模块,组成一个数组赋给chunk.modules
      chunk.modules = this.vendors
    }
    if (this.commons.length > 0) {
      const chunk = new Chunk(this.commons[0])// 根据入口模块得到一个代码块
      chunk.async = true
      this.chunks.push(chunk)
      // 对所有模块进行过滤,找出来那些名称跟这个chunk一样的模块,组成一个数组赋给chunk.modules
      chunk.modules = this.commons
    }

    this.hooks.afterChunks.call(this.chunks)
    this.createChunkAssets()
    callback()
  }

  createChunkAssets() {
    this.chunks.forEach((chunk) => {
      const file = `${chunk.name}.js`
      chunk.files.push(file)
      let source
      if (chunk.async) {
        source = chunkRender({
          chunkName: chunk.entryModule.moduleId,
          modules: chunk.modules,
        })
      }
      else {
        // ! 原单入口
        // source = mainRender({
        //   entryModuleId: chunk.entryModule.moduleId, // ./src/index.js
        //   modules: chunk.modules, // [{moduleId: './src/index.js'}, {moduleId: './src/title.js'}]
        // })
        // ! 多入口
        const deferredChunks: string[] = []
        if (this.vendors.length > 0)
          deferredChunks.push('vendors')
        if (this.commons.length > 0)
          deferredChunks.push('commons')

        console.log({ deferredChunks }, 'deferredChunks')
        source = mainDeferRender({
          entryModuleId: chunk.entryModule.moduleId, // ./src/index.js
          deferredChunks,
          modules: chunk.modules, // 此代码块对应的模块数组[{moduleId:'./src/index.js'},{moduleId:'./src/title.js'}]
        })
      }

      this.emitAssets(file, source)
    })
  }

  emitAssets(file: string, source: string) {
    this.assets[file] = source
    this.files.push(file)
  }
}
