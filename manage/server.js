import http    from 'http'
import path    from 'path'
import express from 'express'
import errorhandler from 'errorhandler'

import config  from './config/config'


const app = express()
const port = config.manageport || 3000

const env = process.env.NODE_ENV || 'development'

/**
 * 用于指定URL路径和服务器路径的映射
 */
const publicDir = path.resolve(__dirname, './public')
app.use('/manage', express.static(publicDir))


/**
 * 判断运行环境,执行不同动作
 */
if (env === 'development') {
  const webpack = require('webpack')
  const webpackDevMiddleware = require('webpack-dev-middleware')
  const webpackHotMiddleware = require('webpack-hot-middleware')
  const webpackConfig = require('../webpack/manage/development/webpack.config.js')
  // webpack 热更新
  const compiler = webpack(webpackConfig)
  app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: webpackConfig.output.publicPath }))
  app.use(webpackHotMiddleware(compiler))

  // handle error
  app.locals.pretty = true
  app.use(errorhandler({
    dumpExceptions: true,
    showStack: true
  }))
}

const router = express.Router()

router.get('/', function(req, res) {
  res.redirect('/manage/login')
})

app.use(router)

app.use(function(req, res) {
  res.sendFile('index.html', { root: __dirname })
})

http.createServer(app).listen(port, '127.0.0.1', (error) => {
  if (error) {
    console.error(error)
  } else {
    console.info("==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.", port, port)
  }
})
