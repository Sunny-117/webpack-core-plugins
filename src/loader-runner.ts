import fs from 'node:fs'
import path from 'node:path'
import { Buffer } from 'node:buffer'

const readFile = fs.readFile.bind(fs)
const PATH_QUERY_FRAGMENT_REGEXP = /^([^?#]*)(\?[^#]*)?(#.*)?$/

function parsePathQueryFragment(resource) {
  const result = PATH_QUERY_FRAGMENT_REGEXP.exec(resource)
  if (result) {
    return {
      path: result[1], // 路径名 ./src/index.js
      query: result[2], //   ?name=xxx
      fragment: result[3], // #top
    }
  }
  throw new Error('reg exec to null')
}
function loadLoader(loaderObject) {
  const normal = require(loaderObject.path)
  if (normal) {
    loaderObject.normal = normal
    loaderObject.pitch = normal.pitch
    loaderObject.raw = normal.raw
  }
}
function convertArgs(args, raw) {
  if (raw && !Buffer.isBuffer(args[0])) { // 如果这个loader需要 buffer,args[0]不是,需要转成buffer
    args[0] = Buffer.from(args[0], 'utf8')
  }
  else if (!raw && Buffer.isBuffer(args[0])) {
    args[0] = args[0].toString('utf8')
  }
}
// loader绝对路径
function createLoaderObject(loader) {
  const obj: any = {
    path: '', // 当前loader的绝对路径
    query: '', // 当前loader的查询参数
    fragment: '', // 当前loader的片段
    normal: null, // 当前loader的normal函数
    pitch: null, // 当前loader的pitch函数
    raw: null, // 是否是Buffer
    data: {}, // 自定义对象 每个loader都会有一个data自定义对象
    pitchExecuted: false, // 当前 loader的pitch函数已经执行过了,不需要再执行了
    normalExecuted: false, // 当前loader的normal函数已经执行过了,不需要再执行
  }
  Object.defineProperty(obj, 'request', {
    get() {
      return obj.path + obj.query + obj.fragment
    },
    set(value) {
      const splittedRequest = parsePathQueryFragment(value)
      obj.path = splittedRequest.path
      obj.query = splittedRequest.query
      obj.fragment = splittedRequest.fragment
    },
  })
  obj.request = loader
  return obj
}
function processResource(options, loaderContext, callback) {
  // 重置loaderIndex 改为loader长度减1
  loaderContext.loaderIndex = loaderContext.loaders.length - 1
  const resourcePath = loaderContext.resourcePath
  // 调用 fs.readFile方法读取资源内容
  options.readResource(resourcePath, (err, buffer) => {
    if (err)
      return callback(err)
    options.resourceBuffer = buffer// resourceBuffer放的是资源的原始内容
    iterateNormalLoaders(options, loaderContext, [buffer], callback)
  })
}
function iterateNormalLoaders(options, loaderContext, args, callback) {
  if (loaderContext.loaderIndex < 0) { // 如果正常的normal loader全部执行完了
    return callback(null, args)
  }
  console.log('=====loaderContext', loaderContext.loaders, loaderContext.loaderIndex)
  const currentLoaderObject = loaderContext.loaders[loaderContext.loaderIndex]
  // 如果说当这个normal已经执行过了,让索引减少1
  if (currentLoaderObject.normalExecuted) {
    loaderContext.loaderIndex--
    return iterateNormalLoaders(options, loaderContext, args, callback)
  }
  const normalFn = currentLoaderObject.normal
  currentLoaderObject.normalExecuted = true
  convertArgs(args, currentLoaderObject.raw)
  runSyncOrAsync(normalFn, loaderContext, args, function (err) {
    if (err)
      return callback(err)
    // eslint-disable-next-line prefer-rest-params
    const args = Array.prototype.slice.call(arguments, 1)
    iterateNormalLoaders(options, loaderContext, args, callback)
  })
}
function iteratePitchingLoaders(options, loaderContext, callback) {
  if (loaderContext.loaderIndex >= loaderContext.loaders.length)
    return processResource(options, loaderContext, callback)

  // 获取当前的loader loaderIndex=0 loader1
  const currentLoaderObject = loaderContext.loaders[loaderContext.loaderIndex]
  if (currentLoaderObject.pitchExecuted) {
    loaderContext.loaderIndex++
    return iteratePitchingLoaders(options, loaderContext, callback)
  }
  loadLoader(currentLoaderObject)
  const pitchFunction = currentLoaderObject.pitch
  currentLoaderObject.pitchExecuted = true
  if (!pitchFunction)
    return iteratePitchingLoaders(options, loaderContext, callback)

  runSyncOrAsync(
    pitchFunction, // 要执行的pitch函数
    loaderContext, // 上下文对象
    // 这是要传递给pitchFunction的参数数组
    [loaderContext.remainingRequest, loaderContext.previousRequest, loaderContext.data = {}],
    (_err, ...args) => {
      if (args.length > 0) { // 如果 args有值,说明这个pitch有返回值
        loaderContext.loaderIndex--// 索引减1,开始回退了
        iterateNormalLoaders(options, loaderContext, args, callback)
      }
      else { // 如果没有返回值,则执行下一个loader的pitch函数
        iteratePitchingLoaders(options, loaderContext, callback)
      }
    },
  )
}
function runSyncOrAsync(fn, context, args, callback) {
  let isSync = true// 默认是同步
  let isDone = false// 是否完成,是否执行过此函数了,默认是false
  const innerCallback = context.callback = function () {
    isDone = true// 表示当前函数已经完成
    isSync = false// 改为异步
    // eslint-disable-next-line prefer-spread, prefer-rest-params
    callback.apply(null, arguments)// 执行 callback
  }
  // 调用context.async this.async 可以把同步把异步,表示这个loader里的代码是异步的
  context.async = function () {
    isSync = false// 改为异步
    return innerCallback
  }

  // 第一次fn=pitch1,执行pitch1
  const result = fn.apply(context, args)
  // 在执行pitch2的时候,还没有执行到pitch1 这行代码
  if (isSync) {
    isDone = true
    return callback(null, result)
  }
}
export function runLoaders(options, callback) {
  console.log(options, '-----options====')
  // 要加载的资源的绝对路径
  const resource = options.resource || ''
  // loaders的数组   loader的绝对路径的数组
  let loaders = options.loaders || []
  // loader执行时候的上下文对象 这个对象将会成为loader执行的时候的this指针
  const loaderContext: any = {}
  // 此方法用来读文件的
  const readResource = options.readResource || readFile
  const splittedResource = parsePathQueryFragment(resource)
  const resourcePath = splittedResource.path// 文件路径
  const resourceQuery = splittedResource.query// 查询参数
  const resourceFragment = splittedResource.fragment// 片段
  const contextDirectory = path.dirname(resourcePath)// 此文件所在的上下文目录
  // 准备loader对象数组
  loaders = loaders.map(createLoaderObject)
  // 要加载的资源的所在目录
  loaderContext.context = contextDirectory
  loaderContext.loaderIndex = 0// 当前的 loader的索引
  loaderContext.loaders = loaders
  loaderContext.resourcePath = resourcePath
  loaderContext.resourceQuery = resourceQuery
  loaderContext.resourceFragment = resourceFragment
  loaderContext.async = null// 是一个方法,可以loader的执行从同步改成异步
  loaderContext.callback = null// 调用下一个loader
  // loaderContext.request代表要加载的资源 ./src/index.js路径里不包含loader
  Object.defineProperty(loaderContext, 'resource', {
    get() {
      return loaderContext.resourcePath + loaderContext.resourceQuery + loaderContext.resourceFragment
    },
  })
  // request =loader1!loader2!loader3!resource.js
  Object.defineProperty(loaderContext, 'request', {
    get() {
      return loaderContext.loaders.map(l => l.request).concat(loaderContext.resource).join('!')
    },
  })
  // 剩下的loader 从当前的下一个loader开始取,加上resource
  Object.defineProperty(loaderContext, 'remainingRequest', {
    get() {
      return loaderContext.loaders.slice(loaderContext.loaderIndex + 1).map(l => l.request).concat(loaderContext.resource).join('!')
    },
  })
  // 当前loader 从当前的loader开始取,加上resource
  Object.defineProperty(loaderContext, 'currentRequest', {
    get() {
      return loaderContext.loaders.slice(loaderContext.loaderIndex).map(l => l.request).concat(loaderContext.resource).join('!')
    },
  })
  // 之前loader
  Object.defineProperty(loaderContext, 'previousRequest', {
    get() {
      return loaderContext.loaders.slice(0, loaderContext.loaderIndex).map(l => l.request)
    },
  })
  // 当前loader的query
  Object.defineProperty(loaderContext, 'query', {
    get() {
      const loader = loaderContext.loaders[loaderContext.loaderIndex]
      return loader.options || loader.query
    },
  })
  // 当前loader的data
  Object.defineProperty(loaderContext, 'data', {
    get() {
      const loader = loaderContext.loaders[loaderContext.loaderIndex]
      return loader.data
    },
  })
  const processOptions = {
    resourceBuffer: null, // 最后我们会把loader执行的Buffer结果放在这里
    readResource,
  }
  iteratePitchingLoaders(processOptions, loaderContext, (err, result) => {
    if (err)
      return callback(err, {})

    callback(null, {
      result,
      resourceBuffer: processOptions.resourceBuffer,
    })
  })
}
