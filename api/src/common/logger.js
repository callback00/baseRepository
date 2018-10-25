// const path = require('path')
const fs = require('fs')
const winston = require('winston')

const config = require('../../config/config')

require('winston-daily-rotate-file')


function getLogger(logFileName) {
  const logDirectory = `${config.rootPath}/logs`

  // 检查日志文件夹是否存在
  if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory)
  }

  // 日志输出的时间格式化
  const tsFormat = () => (new Date()).toLocaleTimeString()

  /**
   * 初始化winston,日志分为5级,从高到低为
   * error | warn | info | verbose | debug | silly
   */
  const logger = new (winston.Logger)({
    transports: [
      new (winston.transports.Console)({
        timestamp: tsFormat,
        colorize: true
      }),

      // 不同日志等级生成不同的日志文件,便于复查
      new (winston.transports.DailyRotateFile)({
        timestamp: tsFormat,
        filename: `${logDirectory}/api-${logFileName}.log`,
        datePattern: 'yyyy-MM-dd.',
        prepend: true // 滚动日志文件名日期在前
      })
    ]
  })

  return logger
}

/**
 * 打印到不同日志文件中
 */
exports.info = (content) => {
  getLogger('info').info(content)
}

exports.warn = (content) => {
  getLogger('warn').warn(content)
}

exports.error = (content) => {
  getLogger('error').error(content)
}
