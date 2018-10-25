const SMSClient = require('@alicloud/sms-sdk')
const request = require('superagent')
const config = require('../../config/config')
const logger = require('./logger')

const errorMessage = {
  'isp.RAM_PERMISSION_DENY': {
    error: 'RAM权限DENY',
    solution: '登陆dayu.aliyun.com解除限制',
  },

  'isv.OUT_OF_SERVICE': {
    error: '业务停机',
    solution: '登陆dayu.aliyun.com充值',
  },

  'isv.PRODUCT_UN_SUBSCRIPT': {
    error: '产品服务未开通',
    solution: '登陆dayu.aliyun.com开通相应的产品服务',
  },

  'isv.PRODUCT_UNSUBSCRIBE': {
    error: '产品服务未开通',
    solution: '登陆dayu.aliyun.com开通相应的产品服务',
  },

  'isv.ACCOUNT_NOT_EXISTS': {
    error: '账户信息不存在',
    solution: '登陆dayu.aliyun.com完成入驻',
  },

  'isv.ACCOUNT_ABNORMAL': {
    error: '账户信息异常',
    solution: '联系技术支持',
  },

  'isv.SMS_TEMPLATE_ILLEGAL': {
    error: '模板不合法',
    solution: '登陆dayu.aliyun.com查询审核通过短信模板使用',
  },

  'isv.SMS_SIGNATURE_ILLEGAL': {
    error: '签名不合法',
    solution: '登陆dayu.aliyun.com查询审核通过的签名使用',
  },

  'isv.MOBILE_NUMBER_ILLEGAL': {
    error: '手机号码格式错误',
    solution: '使用合法的手机号码',
  },

  'isv.MOBILE_COUNT_OVER_LIMIT': {
    error: '手机号码数量超过限制',
    solution: '批量发送，手机号码以英文逗号分隔，不超过200个号码',
  },

  'isv.TEMPLATE_MISSING_PARAMETERS': {
    error: '短信模板变量缺少参数',
    solution: '确认短信模板中变量个数，变量名，检查传参是否遗漏',
  },

  'isv.INVALID_PARAMETERS': {
    error: '参数异常',
    solution: '检查参数是否合法',
  },

  'isv.BUSINESS_LIMIT_CONTROL': {
    error: '触发业务流控限制',
    solution: '短信验证码，使用同一个签名，对同一个手机号码发送短信验证码，支持1条/分钟，5条/小时，10条/天。一个手机号码通过阿里大于平台只能收到40条/天。 短信通知，使用同一签名、同一模板，对同一手机号发送短信通知，允许每天50条（自然日）。',
  },

  'isv.INVALID_JSON_PARAM': {
    error: 'JSON参数不合法',
    solution: 'JSON参数接受字符串值。例如{"code":"123456"}，不接收{"code":123456}',
  },

  'isv.SYSTEM_ERROR': {
    error: '短信服务器错误',
    solution: '联系技术支持',
  },

  'isv.BLACK_KEY_CONTROL_LIMIT': {
    error: '模板变量中存在黑名单关键字。如：阿里大鱼',
    solution: '黑名单关键字禁止在模板变量中使用，若业务确实需要使用，建议将关键字放到模板中，进行审核。',
  },

  'isv.PARAM_NOT_SUPPORT_URL': {
    error: '不支持url为变量',
    solution: '域名和ip请固化到模板申请中',
  },

  'isv.PARAM_LENGTH_LIMIT': {
    error: '变量长度受限',
    solution: '变量长度受限 请尽量固化变量中固定部分',
  },

  'isv.AMOUNT_NOT_ENOUGH': {
    error: '余额不足',
    solution: '因余额不足未能发送成功，请登录管理中心充值后重新发送',
  },
}

const smsClient = new SMSClient({
  accessKeyId: config.accessKeyId,
  secretAccessKey: config.secretAccessKey,
})

module.exports = {
  // 阿里的短信平台接口
  login(mobile, code, callback) {
    if (!config.sms) {
      return callback(null)
    }

    // 发送短信
    smsClient.sendSMS({
      PhoneNumbers: mobile,
      SignName: config.sms_sign,
      TemplateCode: config.sms_login,
      TemplateParam: `{"code":"${code}","product":"${config.name_cn}"}`
    }).then((res) => {
      const { Code } = res
      if (Code === 'OK') {
        // 处理返回参数
        return callback(null, res)
      }

      const errorInfo = errorMessage[Code]
      if (errorInfo) {
        return callback(errorInfo.solution)
      }

      return callback('短信服务器错误!')
    }, (error) => {
      console.log('短信服务器错误:', error)
      return callback('短信服务器错误!')
    })
  },

  // 阿里平台第三方短信接口
  sendCode(mobile, code, callback) {
    request
      .get('https://feginesms.market.alicloudapi.com/codeNotice')
      .set('Authorization', 'APPCODE 2892cd81f085452ab0bdcf23b1c80cc3')
      .query({
        param: code,
        phone: mobile,
        sign: 1,
        skin: 1
      })
      .set('Accept', 'application/json')
      .end((err, res) => {
        if (res.body.Code === 'OK') {
          callback(null, res.body.data)
        } else {
          logger.error(`----- sms sendCode error = ${res.body.Code} -----`)
          callback('系统无法判别手机号区域，请联系管理员。')
        }
      })
  }
}
