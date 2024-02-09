import { AsyncParallelHook, AsyncSeriesHook, SyncBailHook, SyncHook, Tapable } from 'tapable'
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
      done: new AsyncSeriesHook(['stats']), // Triggered after compilation is complete
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
    }
  }

  run(callback) {
    console.log('Compile run...')
    const finalCallback = (err, stats) => {
      callback(err, stats)
    }

    const onCompiled = (err, compilation) => {
      console.log('onCompiled')
      finalCallback(err, new Stats(compilation))
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

      this.hooks.make.callAsync(compilation, (err) => {
        console.log('make finished')
        onCompiled(err, compilation)
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
