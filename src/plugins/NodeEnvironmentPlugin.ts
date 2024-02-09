import fs from 'node:fs'

export class NodeEnvironmentPlugin {
  options: Record<string, unknown>

  constructor(options?) {
    this.options = options || {}
  }

  apply(compiler) {
    compiler.inputFileSystem = fs
    compiler.outputFileSystem = fs
  }
}
