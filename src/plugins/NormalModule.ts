import path from 'node:path'
import types from 'babel-types'
import generate from 'babel-generator'
import traverse from 'babel-traverse'
import async from 'neo-async'
import type { Compilation } from '../Compilation'
import type { Parser } from '../Parser'

interface Dependencies {
  name: string
  context: string
  rawRequest: string
  moduleId: string
  resource: string
}
interface Blocks {
  async: boolean
  entry: string
  name: number
  context: string
}

export class NormalModule {
  name: string
  context: any // /Users/fuzhiqiang/Desktop/jspack
  rawRequest: any // src/index.js
  resource: string // /Users/fuzhiqiang/Desktop/jspack/src/index.js
  parser: Parser
  _source: string | undefined
  _ast: any
  dependencies: Dependencies[]
  moduleId: string | undefined
  blocks: Blocks[]

  async: boolean

  constructor({
    name,
    context,
    rawRequest,
    resource,
    parser,
    moduleId,
    async,
  }) {
    this.name = name
    this.context = context
    this.moduleId = moduleId || (
      `./${path.posix.relative(context, resource)}` // ./src/index.js
    )
    this.rawRequest = rawRequest
    this.resource = resource
    this.parser = parser
    // this._source // source code
    // this._ast
    this.dependencies = [] // the module info of the current module deps
    // 当前模块依赖哪些异步模块 import(那些模块)
    this.blocks = []
    // 表示当前的模块是属于一个异步代码块,还是一个同步代码块
    this.async = async
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
        traverse.default(this._ast, {
          CallExpression: (nodePath) => {
            const node = nodePath.node
            if (node.callee.name === 'require') {
              // 1.把方法名用require改成了__jspack_require__
              node.callee.name = '__jspack_require__'
              const moduleName = node.arguments[0].value
              let depResource
              if (moduleName.startsWith('.')) {
                // 2. get possible module name
                const extName = !moduleName.split(path.posix.sep).pop().includes('.') ? '.js' : ''
                // 3. get absolute path of deps module
                depResource = path.posix.join(path.posix.dirname(this.resource), moduleName + extName)
              }
              else { // the third module
                depResource = require.resolve(path.posix.join(this.context, 'node_modules', moduleName))
                depResource = depResource.replace(/\\/g, '/')// 把window里的 \转成 /
              }
              console.log('depResource >>', depResource) // /Users/fuzhiqiang/Desktop/jspack/playground/src/title.js
              const depModuleId = `.${depResource.slice(this.context.length)}`
              console.log('depModuleId >>', depModuleId) // ./src/title.js
              // ./title.js -> ./src/title.js
              node.arguments = [types.stringLiteral(depModuleId)]
              this.dependencies.push({
                name: this.name, // main
                context: this.context, // root dir
                rawRequest: moduleName, // 模块的相对路径 原始路径
                moduleId: depModuleId, // 模块ID 它是一个相对于根目录的相对路径,以./开头
                resource: depResource, // 依赖模块的绝对路径
              })
            }
            // 判断这个节点CallExpression它的callee是不是import类型
            else if (types.isImport(node.callee)) {
              const moduleName = node.arguments[0].value// 1.模块的名称 ./title.js
              // 2.获得了可能的扩展名
              const extName = !moduleName.split(path.posix.sep).pop().includes('.') ? '.js' : ''
              // 3.获取依赖的模块的绝对路径
              const depResource = path.posix.join(path.posix.dirname(this.resource), moduleName + extName)
              // 4.依赖的模块ID ./+从根目录出发到依赖模块的绝对路径的相对路径 ./src/title.js
              const depModuleId = `./${path.posix.relative(this.context, depResource)}`
              // jspackChunkName: 'title'
              let chunkName = compilation.asyncChunkCounter!++
              if (Array.isArray(node.arguments[0].leadingComments)
                && node.arguments[0].leadingComments.length > 0) {
                const leadingComments = node.arguments[0].leadingComments[0].value
                const regexp = /jspackChunkName:\s*['"]([^'"]+)['"]/
                chunkName = leadingComments.match(regexp)[1] // TODO: 没有匹配项
              }
              nodePath.replaceWithSourceString(`__jspack_require__.e("${chunkName}").then(__jspack_require__.t.bind(null,"${depModuleId}", 7))`)
              // 异步代码块的依赖
              this.blocks.push({
                context: this.context,
                entry: depModuleId,
                name: chunkName,
                async: true,
              })
              console.log(this.blocks, '-------this.blocks-------')
            }
          },
        })
        // 把转换后的语法树重新生成源代码
        const { code } = generate.default(this._ast)
        this._source = code
        async.forEach(this.blocks, (block, done) => {
          const { context, entry, name, async } = block
          compilation._addModuleChain(context, entry, name, async, done)
        }, callback)
      }
      else {
        throw new Error('source code is empty!')
      }
    })
  }

  doBuild(compilation: Compilation, callback) {
    this.getSource(compilation, (_err, source) => {
      // ! process loader ~
      this._source = source
      callback()
    })
  }

  getSource(compilation, callback) {
    compilation.inputFileSystem.readFile(this.resource, 'utf-8', callback)
  }
}
