const { trim, union } = require('lodash')
const jwt = require('jsonwebtoken')
const config = require('../../../../config/config')
const redisUtility = require('../../../common/redisUtility')
const loginOperate = require('../../../operates/manage/user/loginOperate')
module.exports = {

  login: (req, res) => {
    const loginName = trim(req.body.loginName)
    const password = trim(req.body.password)
    const companyId = req.body.companyId

    loginOperate.login(loginName, password, companyId, (error, user, company) => {
      res.type = 'json'

      if (error && error === 'incorrect') {
        res.status(200).json({ error: '用户名或密码错误!' })
      } else if (error) {
        res.status(200).json({ error })
      } else if (user !== null) {
        let apiPermissions = []

        // 这里应该写的是api权限，页面的路由权限不在此处记录。
        if (user.Apis && user.Apis.length > 0) {
          user.Apis.forEach((apiItem) => {
            apiPermissions.push(apiItem.url)
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
            loginName,
            displayName: user.displayName,
            telphone: user.telphone,
            apiPermissions: apiPermissions,
            companyId,
            company
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
    const userId = req.user.userId

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