const path = require('path')

module.exports = {

  name: 'TOURISM SYSTEM',
  name_cn: 'XXX',

  // 服务端口
  apiport: 8081,
  // manageport: 8082,
  // fileport: 8084,


  // 功能开关
  auth: true,
  cache: true,
  sms: true,
  sms_default: true,
  sms_default_code: '6666',


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
  cache_maxAge: 60, // 缓存时间，单位：秒
  code_maxAge: 15 * 60, // 短信验证码缓存时间，单位：秒

  wxapp_token_maxAge: 1.5 * 60 * 60, // 微信token缓存时间，单位：秒
  wxapp_retry_maxAge: 60, // 微信token重试时间，单位：秒
  cache_file_key: 'cache', // 上传文件名称
  cache_file_expire: 12 * 60 * 60, // 不操作有效期12小时


  // 小程序
  wxapp_appid: 'wx00b8f12720ad60bb',
  wxapp_secret: 'a74273589de59a7d556d70b269097a22',

  wxapp_template_id: 'WzHmaBVMPKoTKNXPyvgXpFsjacyoAS4_LtZ2CJCJH6A',
  token_url: 'https://api.weixin.qq.com/cgi-bin/token',
  message_send_url: 'https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send',
  wxacode_url: 'https://api.weixin.qq.com/wxa/getwxacodeunlimit',//不限量获取小程序二维码接口

  // 短信
  accessKeyId: 'LTAIxGnDKvOIgXGk',
  secretAccessKey: 'lPBQZcs4DEmZoW6DMZAfHEnTTdOJd4',
  sms_sign: 'XXX',

  // 短信模板编号
  sms_login: 'SMS_35015550',
}
