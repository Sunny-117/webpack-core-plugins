import path, { dirname } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default {
  context: process.cwd(),
  mode: 'development',
  entry: './src/index-less.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    chunkFilename: '[name].js',
  },
  // 自定义查找loader模块路径
  resolveLoader: {
    modules: ['loaders', 'node_modules'],
  },
  module: {
    rules: [
      {
        test: /\.less$/,
        use: ['style-loader', 'less-loader'],
      },
    ],
  },
}
