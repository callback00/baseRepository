/* global API_SERVER_ROOT */

import jwt from 'jwt-decode'
import request from 'superagent'

import tools from './tools'

export default {
  // 跟后台服务器校验登录情况
  login(loginname, password, callback) {
    const md5password = tools.md5password(password)

    request
      .post(`${API_SERVER_ROOT}/login`)
      .send({
        loginname,
        password: md5password
      })
      .set('Accept', 'application/json')
      .end((err, res) => {
        if (res.statusCode === 200) {
          if (res.body.success) {
            // 将 token 用 localStorage 保存起来
            tools.setToken(res.body.success)
            callback({ success: true })
          } else {
            callback(res.body)
          }
        } else {
          callback({
            statusCode: res.statusCode,
            error: res.body
          })
        }
      })
  },

  // 判断是否已经登录
  isLoggedIn() {
    const tokenString = tools.getToken()

    if (tokenString && tokenString.length > 0) {
      const token = jwt(tokenString)
      const now = Date.now() / 1000
      return /* token.iat < now && */token.exp > now
    }

    return false
  },

  logout() {
    const tokenString = tools.getToken()
    window.localStorage.clear()

    request
      .post(`${API_SERVER_ROOT}/logout`)
      .set('Authorization', `Basic ${tokenString}`)
      .end()
  },


  // 修改当前登录用户密码
  update(expire, password, callback) {
    const md5expire = tools.md5password(expire)
    const md5password = tools.md5password(password)
    const tokenString = tools.getToken()

    request
      .post(`${API_SERVER_ROOT}/password`)
      .head({ Authorization: `Basic ${tokenString}` })
      .send({
        expire: md5expire,
        password: md5password
      })
      .set('Accept', 'application/json')
      .end((err, res) => {
        if (res.statusCode === 200 && res.body.success) {
          callback({ success: true })
        } else if (res.statusCode === 202 && res.body.error) {
          callback({ error: res.body.error })
        } else if (res.statusCode === 401 && res.body.auth) {
          callback({ auth: res.body.auth })
        } else {
          callback({ error: '连接中断，请重试' })
        }
      })
  },

  getPath() {
    const tokenString = tools.getToken()

    if (tokenString && tokenString.length > 0) {
      const token = jwt(tokenString)
      if (token) {
        return token.reveal
      }
    }

    return null
  },

  getName() {
    const tokenString = tools.getToken()

    if (tokenString && tokenString.length > 0) {
      const token = jwt(tokenString)
      if (token) {
        return token.displayname
      }
    }

    return null
  }

}
