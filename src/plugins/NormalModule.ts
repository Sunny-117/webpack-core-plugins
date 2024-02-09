import type { Compilation } from '../Compilation'
import type { Parser } from '../Parser'

export class NormalModule {
  name: string
  context: any // /Users/fuzhiqiang/Desktop/jspack
  rawRequest: any // src/index.js
  resource: string // /Users/fuzhiqiang/Desktop/jspack/src/index.js
  parser: Parser
  _source: string | undefined
  _ast: any
  constructor({
    name,
    context,
    rawRequest,
    resource,
    parser,
  }) {
    this.name = name
    this.context = context
    this.rawRequest = rawRequest
    this.resource = resource
    this.parser = parser
    // this._source // source code
    // this._ast
  }

  /**
   * 1.从硬盘上把模块内容读出来,读成一个文本
   * 2.可能它不是一个JS模块,所以会可能要走loader的转换,最终肯定要得到一个JS模块代码,得不到就报错了
   * 3.把这个JS模块代码经过parser处理转成抽象语法树AST
   * 4.分析AST里面的依赖,也就是找 require import节点,分析依赖的模块
   * 5.递归的编译依赖的模块
   * 6.不停的依次递归执行上面5步,直到所有的模块都编译完成为止
   */
  build(compilation: Compilation, callback) {
    this.doBuild(compilation, (_err) => {
      if (this._source) {
        this._ast = this.parser.parse(this._source)
        callback()
      }
      else {
        throw new Error('source code is empty!')
      }
    })
  }

  doBuild(compilation: Compilation, callback) {
    this.getSource(compilation, (_err, source) => {
      this._source = source
      callback()
    })
  }

  getSource(compilation, callback) {
    compilation.inputFileSystem.readFile(this.resource, 'utf-8', callback)
  }
}
