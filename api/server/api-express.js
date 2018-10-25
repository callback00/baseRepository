/**
 * NodeJS 自带库
 */
const fs = require('fs')
// const path = require('path')

/**
 * Express 及相关库
 */
const bodyParser = require('body-parser') // 提供 JSON / Raw / Text / URL-encoded 解析
const morgan = require('morgan') // HTTP request logger
const fsr = require('file-stream-rotator') // 每天自动生成一个日志文件
const compression = require('compression') // Http Request 压缩
const errorhandler = require('errorhandler') // 错误处理,仅用于Development模式
// const favicon = require('serve-favicon')


module.exports = (app, env, config) => {
  /**
   * 信任反向代理层,即Nginx,用于 Https 的信任
   */
  app.set('trust proxy', 1)


  /**
   * Http 请求解析成 json / text / raw / URL-encoded
   */
  app.use(bodyParser.urlencoded({
    extended: true,
    limit: '10mb'
  }))

  app.use(bodyParser.json({
    limit: '10mb'
  }))


  /**
   * 服务器日志
   */
  const logDirectory = `${config.rootPath}/logs`

  // 确保日志文件存在
  if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory)
  }

  // 创建一个循环的写入流
  const accessLogStream = fsr.getStream({
    date_format: 'YYYYMMDD',
    filename: `${logDirectory}/%DATE%-api.log`,
    frequency: 'daily',
    verbose: false
  })

  app.use(morgan('short', {
    stream: accessLogStream
  }))


  // app.use(favicon(path.resolve(`${config.rootPath}/favicon.ico`)))


  /**
   * Http Request 压缩
   */
  app.use(
    compression({ threshhold: 512 },
      (req, res) => /json|text|javascript|css/.test(res.getHeader('Content-Type')),
      { level: 9 })
  )


  /**
   * 用于指定URL路径和服务器路径的映射
   */
  // app.use(express.static(path.resolve(config.rootPath, '/public')))


  // Cross-Domain Allow Security
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', req.headers.origin)
    res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-type, X-Requested-With')
    res.header('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, DELETE')
    // res.header('Access-Control-Request-Headers', 'X-Requested-With')
    res.header('Access-Control-Allow-Credentials', 'true')

    // 有些浏览器（例如 chrome）会预先发送 OPTIONS 请求确认连接是否可用，直接返回可用，并设置有效期即可
    // 这个 OPTIONS 请求也会生成对应的 session，但是不再复用，需要手动销毁（不然 redis 会看到一大堆的无效 session）
    if (req.method === 'OPTIONS') {
      res.header('Access-Control-Max-Age', 7200)
      res.status(200).end()
      return
    }

    next()
  })


  /**
   * 判断运行环境,执行不同动作
   */
  if (env === 'development') {

    app.locals.pretty = true

    app.use(errorhandler({
      dumpExceptions: true,
      showStack: true
    }))
  }

  // if (env === 'production') {}

}
