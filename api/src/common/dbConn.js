const sequelize = require('sequelize')

const config = require('../../config/config')

/**
 * 构造数据库连接
 */
const conn = new sequelize(config.db_database, config.db_username, config.db_password, {
  host: config.db_host,
  port: config.db_port,
  dialect: config.db_type,
  pool: {
    maxConnections: config.db_maxConnection,
    maxIdleTime: config.db_maxIdleTime
  },
  dialectOptions: {
    charset: config.db_charset
  },
  timezone: '+08:00'
})


/**
 * 外部获取数据库接口
 */
exports.getConn = () => {
  return conn
}
