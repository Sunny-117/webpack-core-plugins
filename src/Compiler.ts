import type { JsPackOptions } from '.'

// 递归的创建新的文件夹
export class Compiler {
  context: any
  hooks: unknown
  options: JsPackOptions

  constructor(context) {
    this.context = context
    this.options = {} as JsPackOptions
  }
}
