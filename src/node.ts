import fs from 'node:fs'
import path, { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export function customRequire(modulePath) {
  // 获取完整的模块路径
  const fullPath = path.resolve(__dirname, modulePath)

  // 检查模块文件是否存在
  if (!fs.existsSync(fullPath))
    throw new Error(`Module not found: ${modulePath}`)

  // 读取模块文件内容
  const moduleContent = fs.readFileSync(fullPath, 'utf8')

  // 创建一个模拟的模块对象
  const module = {
    exports: {},
  }

  // 使用 Function 构造函数动态创建一个函数
  // 该函数的内容为模块文件的内容，并且在执行时传入 module, exports, require, __dirname, __filename 等参数
  // eslint-disable-next-line no-new-func
  const wrapperFunction = new Function('module', 'exports', 'require', '__dirname', '__filename', moduleContent)

  // 执行该函数，模拟模块的加载
  wrapperFunction(module, module.exports, customRequire, __dirname, fullPath)

  // 返回模块的 exports 对象
  return module.exports
}
