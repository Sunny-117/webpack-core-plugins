import path from 'node:path'
import { AsyncParallelHook, AsyncSeriesHook, SyncBailHook, SyncHook, Tapable } from 'tapable'
import mkdirp from 'mkdirp'
import { NormalModuleFactory } from './plugins/NormalModuleFactory'
import { Compilation } from './Compilation'
import { Stats } from './Stats'
import type { JsPackOptions } from '.'

export interface hooksType {
  done: any
  entryOption: any
  make: any
  beforeRun: any
  run: any
  beforeCompile: any
  compile: any
  afterCompile: any
  thisCompilation: any
  compilation: any
  emit: any
}
export class Compiler extends Tapable {
  context: any
  hooks: hooksType
  options: JsPackOptions
  inputFileSystem: any
  outputFileSystem: any

  constructor(context) {
    super()
    this.options = {} as JsPackOptions
    this.context = context
    this.hooks = {
      /**
       * context: the absolute path of project root dir
       * entry: the file path of entry
       */
      entryOption: new SyncBailHook(['context', 'entry']),
      beforeRun: new AsyncSeriesHook(['compiler']),
      run: new AsyncSeriesHook(['compiler']),
      beforeCompile: new AsyncSeriesHook(['params']),
      compile: new SyncHook(['params']),
      make: new AsyncParallelHook(['compilation']), // build
      thisCompilation: new SyncHook(['compilation', 'params']), // start a new compile
      compilation: new SyncHook(['compilation', 'params']), // create a new compile
      afterCompile: new AsyncSeriesHook(['compilation']), // compile finished
      emit: new AsyncSeriesHook(['compilation']), // write to file
      done: new AsyncSeriesHook(['stats']), // Triggered after compilation is complete
    }
  }

  emitAssets(compilation, callback) {
    const emitFiles = (_err) => {
      const assets = compilation.assets
      const outputPath = compilation.options.output.path // dist
      for (const file in assets) {
        const source = assets[file]
        const targetPath = path.posix.join(outputPath, file)
        this.outputFileSystem.writeFileSync(targetPath, source, 'utf8')
      }
      callback()
    }
    // 先触发emit的回调,在写插件的时候emit用的很多,因为它是我们修改输出内容的最后机会
    this.hooks.emit.callAsync(compilation, () => {
      // 先创建输出目录dist,再写入文件
      mkdirp(this.options.output.path, emitFiles) // 递归的创建新文件夹
    })
  }

  run(callback) {
    console.log('Compile run...')

    const onCompiled = (_err, compilation) => {
      console.log('onCompiled')
      // transform chunk to file and write
      this.emitAssets(compilation, (_err) => {
        const stats = new Stats(compilation)
        this.hooks.done.callAsync(stats, (err) => {
          console.log('finished all compile')
          callback(err, stats)
        })
      })
    }
    this.hooks.beforeRun.callAsync(this, (_err) => {
      this.hooks.run.callAsync(this, (_err) => {
        this.compile(onCompiled)
      })
    })
  }

  compile(onCompiled) {
    const params = this.newCompilationParams()
    this.hooks.beforeCompile.callAsync(params, (_err) => {
      this.hooks.compile.call(params)
      const compilation = this.newCompilation(params)

      this.hooks.make.callAsync(compilation, (_err) => {
        compilation.seal((_err) => {
          this.hooks.afterCompile.callAsync(compilation, (err) => {
            console.log('make finished')
            onCompiled(err, compilation)
          })
        })
      })
    })
  }

  createCompilation() {
    return new Compilation(this)
  }

  newCompilation(params) {
    const compilation = this.createCompilation()
    this.hooks.thisCompilation.call(compilation, params)
    this.hooks.compilation.call(compilation, params)
    return compilation
  }

  newCompilationParams() {
    const params = {
      normalModuleFactory: new NormalModuleFactory(),
    }
    return params
  }
}
