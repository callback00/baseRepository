const request = require('superagent')

const config = require('./config/config')
const redisUtility = require('./src/common/redisUtility')

function getToken() {
  console.log('getToken start')
  request
    .get(config.token_url)
    .query({
      appid: config.wxapp_appid,
      secret: config.wxapp_secret,
      grant_type: 'client_credential',
    })
    .set('Accept', 'application/json')
    .end((err, res) => {

      if (res && res.statusCode === 200 && res.body.access_token) {
        const token = res.body.access_token
        redisUtility.setCache(config.wxapp_appid, config.wxapp_secret, res.body, config.wxapp_token_maxAge)

        console.log('Get wxapp token success, token: ', token)

        setTimeout(() => {
          getToken()
        }, config.wxapp_token_maxAge * 1000)
      } else {
        console.log('Get wxapp token fail, retry again in 60s.')

        setTimeout(() => {
          getToken()
        }, config.wxapp_retry_maxAge * 1000)
      }

    })
}

getToken()
