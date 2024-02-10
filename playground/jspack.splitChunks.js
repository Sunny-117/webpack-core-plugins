import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import process from 'node:process'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default {
  context: process.cwd(),
  mode: 'development',
  devtool: false,
  entry: {
    page1: './src/page/page1.js',
    page2: './src/page/page2.js',
  },
  output: {
    path: resolve(__dirname, 'dist'),
    filename: '[name].js',
    chunkFilename: '[name].js',
  },
}
