/**************************************
 * Created by lemon on 2016年01月11日
 * Description: 邕城通系统 js 公用方法
 **************************************/
/* global API_SERVER_ROOT */

import assign from 'lodash.assign'
import request from 'superagent'
import md5 from 'md5'

const tokenKey = 'system-manage-token'

export default {

  setToken(token) {
    window.localStorage.setItem(tokenKey, token)
  },

  getToken() {
    return window.localStorage.getItem(tokenKey)
  },

  get(url, callback, params = {}, addto = {}) {
    const para = this.convert(params)
    const tokenString = this.getToken()

    request
      .get(API_SERVER_ROOT + url)
      .set('Authorization', `Basic ${tokenString}`)
      .send(para)
      .set('Accept', 'application/json')
      .end((err, res) => {
        if (res.statusCode === 200) {
          assign(addto, res.body) 
          callback(addto)
        } else {
          callback({ error: '连接中断，请重试' })
        }
      })
  },

  post(url, callback, params = {}, addto = {}) {
    const para = this.convert(params)
    const tokenString = this.getToken()

    request
      .post(API_SERVER_ROOT + url)
      .set('Authorization', `Basic ${tokenString}`)
      .send(para)
      .set('Accept', 'application/json')
      .end((err, res) => {
        if (res.statusCode === 200) {
          assign(addto, res.body) 
          callback(addto)
        } else {
          callback({ error: '连接中断，请重试' })
        }
      })
  },

  put(url, callback, params = {}, addto = {}) {
    const para = this.convert(params)
    const tokenString = this.getToken()

    request
      .put(API_SERVER_ROOT + url)
      .set('Authorization', `Basic ${tokenString}`)
      .send(para)
      .set('Accept', 'application/json')
      .end((err, res) => {
        if (res.statusCode === 200) {
          assign(addto, res.body) 
          callback(addto)
        } else {
          callback({ error: '连接中断，请重试' })
        }
      })
  },

  putWithFile(url, callback, files, params = {}, addto = {}) {
    const para = this.convert(params)
    const tokenString = this.getToken()

    const datas = new FormData()
    files.forEach((data) => {
      datas.append('documents[]', data, data.name)
    })

    for (const key in para) {
      datas.append(key, para[key])
    }

    request
      .put(API_SERVER_ROOT + url)
      .set('Authorization', `Basic ${tokenString}`)
      .send(datas)
      .set('Accept', 'application/json')
      // .set('Content-Type', 'multipart/form-data')
      .end((err, res) => {
        if (res.statusCode === 200) {
          assign(addto, res.body) 
          callback(addto)
        } else {
          callback({ error: '连接中断，请重试' })
        }
      })
  },

  del(url, callback, params = {}, addto = {}) {
    const para = this.convert(params)
    const tokenString = this.getToken()

    request
      .del(API_SERVER_ROOT + url)
      .set('Authorization', `Basic ${tokenString}`)
      .send(para)
      .set('Accept', 'application/json')
      .end((err, res) => {
        if (res.statusCode === 200) {
          assign(addto, res.body) 
          callback(addto)
        } else {
          callback({ error: '连接中断，请重试' })
        }
      })
  },

  convert(params) {
    const para = {}
    if (params !== null) {
      for (const key in params) {
        const value = params[key]
        if (value instanceof Array) {
          para[key] = JSON.stringify(value)
        } else {
          para[key] = value
        }
      }
    }

    return para
  },

  md5password(password) {
    if (password === null || password.length === 0) {
      return ''
    }

    const md5password = md5(password)
    return md5password
  },

  exportExcel(url, container) {
    const link = document.createElement('A')
    link.href = API_SERVER_ROOT + url
    link.download = API_SERVER_ROOT + url
    link.target = '_blank'
    container.appendChild(link)
    link.click()
    container.removeChild(link)
  }
}
