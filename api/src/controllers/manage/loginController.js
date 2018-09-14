const { trim, union } = require('lodash')
const jwt = require('jsonwebtoken')
const config = require('../../../config/config')
const redisUtility = require('../../common/redisUtility')
const loginOperate = require('../../operates/manage/loginOperate')
module.exports = {
  /**
   * 用户登录
   */
  login_Old: (req, res) => {
    const loginName = trim(req.body.loginName)
    const password = trim(req.body.password)

    loginOperate.login(loginName, password, (error, user) => {
      res.type = 'json'

      if (error && error === 'incorrect') {
        res.status(200).json({ error: '用户名或密码错误!' })
      } else if (error) {
        res.status(200).json({ error })
      } else if (user !== null) {
        let reveals = []
        let permissions = []

        // 把权限列表从json中分割并且组成新的数组
        if (user.rules && user.rules.length > 0) {
          user.rules.forEach((rule) => {
            const reveal = rule.reveal.split(',')
            reveals = union(reveals, reveal)
            const permission = rule.permission.split(',')
            permissions = union(permissions, permission)
          })
        }

        const expiresIn = '7d'

        const payload = {
          displayName: user.displayName,
          reveal: reveals,
          authorization: user.userId
        }

        const success = jwt.sign(payload, config.secret, {
          algorithm: 'HS512',
          expiresIn
        })

        if (config.auth) {

          redisUtility.setUser(user.userId, {
            userId: user.userId,
            displayName: user.displayName,
            telphone: user.telphone,
            role: user.role,
            permission: permissions
          })

        }

        res.status(200).json({ success })
      } // end if user is not null
    }) // end loginOperate.login
  }, // end this.login

  login: (req, res) => {
    const loginName = trim(req.body.loginName)
    const password = trim(req.body.password)

    loginOperate.login(loginName, password, (error, user) => {
      res.type = 'json'

      if (error && error === 'incorrect') {
        res.status(200).json({ error: '用户名或密码错误!' })
      } else if (error) {
        res.status(200).json({ error })
      } else if (user !== null) {
        let menuPermissions = []

        // 这里应该写的是api权限，页面的路由权限不在此处记录。
        if (user.Menus && user.Menus.length > 0) {
          user.Menus.forEach((menu) => {
            menuPermissions.push(menu.id)
          })
        }

        const expiresIn = '7d'

        const payload = {
          displayName: user.displayName,
          authorization: user.userId
        }

        const success = jwt.sign(payload, config.secret, {
          algorithm: 'HS512',
          expiresIn
        })

        if (config.auth) {

          redisUtility.setUser(user.userId, {
            userId: user.userId,
            displayName: user.displayName,
            telphone: user.telphone,
            menuPermissions: menuPermissions
          })
        }

        res.status(200).json({ success })
      } // end if user is not null
    }) // end loginOperate.login
  }, // end this.login

  /**
   * 修改用户密码
   */
  updatePassword: (req, res) => {
    const expire = trim(req.body.expire)
    const password = trim(req.body.password)
    const userId = req.userId

    loginOperate.updatePassword(userId, expire, password, (error, success) => {

      if (error) {
        res.status(200).json({ error })
      } else {
        res.status(200).json({ success })
        redisUtility.deleteUser(userId)
      }
    })
  },
}