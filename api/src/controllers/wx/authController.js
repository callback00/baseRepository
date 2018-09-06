const jwt = require('jsonwebtoken')
const https = require('https')
const { trim, union } = require('lodash')
const moment = require('moment')

const config = require('../../../config/config')
const redisUtility = require('../../common/redisUtility')
const seed = require('../../common/seed')
const sms = require('../../common/sms')
const tools = require('../../common/tools')

const authOperate = require('../../operates/wx/authOperate')

moment.locale('zh-cn')
const key = '@code'

module.exports = {

  /**
   * 获取手机验证码
   */
  sendCode: (req, res) => {
    const mobile = trim(req.body.mobile)

    if (tools.checkMoblie(mobile)) {
      res.type = 'json'
      res.status(200).json({ error: '无效的手机号码!' })
      return
    }

    if (config.sms_default) {
      // 保存到 redis 中
      redisUtility.setCache(mobile, key, config.sms_default_code, 60 * 15)
      res.type = 'json'
      res.status(200).json({ success: 'success' })
      return
    }

    // 生成随机验证码
    const code = seed.getSeed()
    console.log('sendCode: ', mobile, code)

    sms.sendCode(mobile, code, (error, json) => {
      res.type = 'json'

      if (error) {
        res.status(200).json({ error })
      } else {
        // 保存到 redis 中
        redisUtility.setCache(mobile, key, code, 60 * 15)
        res.status(200).json({ success: 'success' })
      }
    })
  },


  /**
   * 验证手机号
   */
  wxappLogin: (req, res) => {
    const mobile = trim(req.body.mobile)
    const code = trim(req.body.code)
    const province = trim(req.body.province)

    if (tools.checkMoblie(mobile)) {
      res.type = 'json'
      res.status(200).json({ error: '无效的手机号码!' })
      return
    }

    redisUtility.getCache(mobile, key, (current) => {
      res.type = 'json'

      if (!current) {
        res.status(200).json({ error: '无效短信验证码!' })
        return
      }

      if (current !== code) {
        res.status(200).json({ error: '短信验证码错误!' })
        return
      }

      authOperate.wxappLogin(mobile, (error, userInfo) => {

        if (error) {
          res.status(200).json({ error })
        } else {
          redisUtility.setUser(mobile, userInfo)

          // 需要加密的内容
          const payload = {
            authorization: mobile, // 唯一标识
          }

          // 加密后的数据传给前端，前端每次调用api时将authorization带回来
          const authorization = jwt.sign(payload, config.secret, {
            algorithm: 'HS512',
            expiresIn: '7d'
          })

          const success = {
            authorization,
            userInfo: { mobile: userInfo.mobile, province: userInfo.province, city: userInfo.city }
          }

          res.status(200).json({ success })
        }
      })
    })
  }
}
