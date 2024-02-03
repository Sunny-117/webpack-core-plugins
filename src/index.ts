import { Compiler } from './Compiler'
import { NodeEnvironmentPlugin } from './node/NodeEnvironmentPlugin'

export interface JsPackPluginOptions {
  name: string
  // eslint-disable-next-line ts/no-misused-new
  constructor(options?: object)
  apply(compiler: Compiler): void
}

export interface JsPackOptions {
  plugins: JsPackPluginOptions[]
  cwd: string
  mode: 'development' | 'production'
  devtool: boolean
  entry: string
  output: {
    path: string
    filename: string
  }
}

export function jspack(options: JsPackOptions) {
  const compiler = new Compiler(options)
  compiler.options = options
  new NodeEnvironmentPlugin().apply(compiler) // Enable the compiler to read and write files

  // Mount the plugins provided in the configuration file
  const plugins = options.plugins
  if (plugins && Array.isArray(plugins)) {
    for (const plugin of plugins)
      plugin.apply(compiler)
  }

  return compiler
}
