const { trim, union } = require('lodash')
const jwt = require('jsonwebtoken')
const config = require('../../../config/config')
const redisUtility = require('../../common/redisUtility')
const loginOperate = require('../../operates/manage/loginOperate')
module.exports = {
  /**
   * 用户登录
   */
  login: (req, res) => {
    const loginname = trim(req.body.loginname)
    const password = trim(req.body.password)

    loginOperate.login(loginname, password, (error, user) => {
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
          displayname: user.displayname,
          reveal: reveals,
          authorization: user.userid
        }

        const success = jwt.sign(payload, config.secret, {
          algorithm: 'HS512',
          expiresIn
        })

        if (config.auth) {

          redisUtility.setUser(user.userid, {
            userid: user.userid,
            displayname: user.displayname,
            telphone: user.telphone,
            role: user.role,
            permission: permissions
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
    const userid = req.userid

    loginOperate.updatePassword(userid, expire, password, (error, success) => {

      if (error) {
        res.status(200).json({ error })
      } else {
        res.status(200).json({ success })
        redisUtility.deleteUser(userid)
      }
    })
  },
}