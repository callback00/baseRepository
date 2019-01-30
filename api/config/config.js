const path = require('path')

module.exports = {

  name: 'TOURISM SYSTEM',
  name_cn: 'XXX',

  // 服务端口
  apiport: 8081,
  socketport: 8083,

  // 功能开关
  auth: true,
  cache: true,
  sms: true,
  sms_default: true,
  sms_default_code: '6666',
  notice_open: true,


  // 项目常规配置
  rootPath: path.resolve(__dirname, '../'),

  secret: 'Sound Horizon',


  // 数据库参数
  db_type: 'mysql',
  db_host: '127.0.0.1',
  db_username: 'root',
  db_password: '123456',

  db_database: 'tourism',
  db_port: 3306,
  db_charset: 'utf8mb4',
  db_maxConnection: 50,
  db_maxIdleTime: 30,


  // redis缓存参数
  redis_host: '127.0.0.1',
  redis_port: 3603,
  redis_maxAge: 7 * 24 * 60 * 60, // cookie缓存时间，单位：秒
  // redis_maxAge: 10, // cookie缓存时间，单位：秒

  cache_maxAge: 60, // 缓存时间，单位：秒
  code_maxAge: 15 * 60, // 短信验证码缓存时间，单位：秒

  //socket.io 配置
  socket_origins: 'http://localhost:8082',

  // 短信
  accessKeyId: 'LTAIxGnDKvOIgXGk',
  secretAccessKey: 'lPBQZcs4DEmZoW6DMZAfHEnTTdOJd4',
  sms_sign: 'XXX',

  // 短信模板编号
  sms_login: 'SMS_35015550',
}
