const { trim } = require('lodash')

const redisUtility = require('../../common/redisUtility')
const tools = require('../../common/tools')

const userOperate = require('../../operates/manage/userOperate')

module.exports = {
  /**
   * 创建用户
   */
  createUser: (req, res) => {
    const data = {
      displayName: trim(req.body.displayName),
      loginName: trim(req.body.loginName),
      password: trim(req.body.password),
      telphone: trim(req.body.telphone) || null,
    }

    if (data.telphone && tools.checkMoblie(data.telphone)) {
      res.type = 'json'
      res.status(200).json({ error: '无效的联系电话' })
      return
    }

    const _adds = trim(req.body.adds)
    const adds = _adds ? JSON.parse(_adds) : null

    userOperate.userExist(data.loginName, (err1, user) => {
      res.type = 'json'

      if ((err1 === null) && (user !== null)) {
        res.status(200).json({ error: '用户已存在' })
      } else {

        userOperate.createUser(data, adds, (error, success) => {
          if (error !== null) {
            res.status(200).json({ error })
          } else {
            res.status(200).json({ success })
            redisUtility.reset(req.sessionID)
          }
        })

      }
    })
  },


  /**
   * 更新用户信息
   */
  updateUser: (req, res) => {
    const userId = trim(req.body.userId)
    const password = trim(req.body.password)
    const data = {
      displayName: trim(req.body.displayName),
      telphone: trim(req.body.telphone) || null,
    }

    if (data.telphone && tools.checkMoblie(data.telphone)) {
      res.type = 'json'
      res.status(200).json({ error: '无效的联系电话' })
      return
    }

    if (password && password.length > 0) {
      data.password = password
    }

    const _adds = trim(req.body.adds)
    const adds = _adds ? JSON.parse(_adds) : null

    const _deletes = trim(req.body.deletes)
    const deletes = _adds ? JSON.parse(_deletes) : null

    userOperate.updateUser(userId, data, adds, deletes, (error, success) => {
      res.type = 'json'

      if (error) {
        res.status(200).json({ error })
      } else {
        res.status(200).json({ success })
        redisUtility.deleteUser(userId)
        redisUtility.reset(req.sessionID)
      }
    })
  },


  /**
   * 删除用户
   */
  deleteUser: (req, res) => {
    const userId = trim(req.body.userId)

    userOperate.deleteUser(userId, (error, success) => {
      res.type = 'json'

      if (error) {
        res.status(200).json({ error })
      } else {
        res.status(200).json({ success })
        redisUtility.deleteUser(userId)
        redisUtility.reset(req.sessionID)
      }
    })
  },


  /**
   * 获取用户信息
   */
  getUserInfo: (req, res) => {
    const userId = trim(req.body.userId)

    userOperate.getUserInfo(userId, (error, success) => {
      res.type = 'json'

      if (error) {
        res.status(200).json({ error })
      } else {
        res.status(200).json({ success })
        const key = redisUtility.createKey(req.originalUrl, req.body)
        redisUtility.setCache(req.sessionID, key, success)
      }
    })
  },


  /**
   * 获取用户列表
   */
  getUserList: (req, res) => {
    const pageindex = trim(req.body.pageindex)

    userOperate.getUserList(pageindex, (error, success) => {
      res.type = 'json'

      if (error) {
        res.status(200).json({ error })
      } else {
        res.status(200).json({ success })
        const key = redisUtility.createKey(req.originalUrl, req.body)
        redisUtility.setCache(req.sessionID, key, success)
      }
    })
  },

  /**
   * 获取用户名称列表
   */
  getUserName: (req, res) => {
    const pageindex = trim(req.body.pageindex)

    userOperate.getUserName(pageindex, (error, success) => {
      res.type = 'json'

      if (error) {
        res.status(200).json({ error })
      } else {
        res.status(200).json({ success })
        const key = redisUtility.createKey(req.originalUrl, req.body)
        redisUtility.setCache(req.sessionID, key, success)
      }
    })
  },

  /**
 * 获取用户信息
 */
  getMyInfo: (req, res) => {
    const userId = trim(req.userId)

    userOperate.getMyInfo(userId, (error, success) => {
      res.type = 'json'

      if (error) {
        res.status(200).json({ error })
      } else {
        res.status(200).json({ success })
      }
    })
  },

  /**
 * 更新用户信息
 */
  updateMyInfo: (req, res) => {
    const userId = trim(req.userId)

    const data = {
      displayName: trim(req.body.displayName),
      telphone: trim(req.body.telphone) || null,
      gender: trim(req.body.gender) || "1",
      remark: trim(req.body.remark) || "",
    }

    if (data.telphone && tools.checkMoblie(data.telphone)) {
      res.type = 'json'
      res.status(200).json({ error: '无效的联系电话' })
      return
    }

    userOperate.updateMyInfo(userId, data, (error, success) => {
      res.type = 'json'

      if (error) {
        res.status(200).json({ error })
      } else {
        res.status(200).json({ success })
      }
    })
  },
}
