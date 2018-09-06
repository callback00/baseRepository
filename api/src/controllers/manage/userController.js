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
      displayname: trim(req.body.displayname),
      loginname: trim(req.body.loginname),
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

    userOperate.userExist(data.loginname, (err1, user) => {
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
    const userid = trim(req.body.userid)
    const password = trim(req.body.password)
    const data = {
      displayname: trim(req.body.displayname),
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

    userOperate.updateUser(userid, data, adds, deletes, (error, success) => {
      res.type = 'json'

      if (error) {
        res.status(200).json({ error })
      } else {
        res.status(200).json({ success })
        redisUtility.deleteUser(userid)
        redisUtility.reset(req.sessionID)
      }
    })
  },


  /**
   * 删除用户
   */
  deleteUser: (req, res) => {
    const userid = trim(req.body.userid)

    userOperate.deleteUser(userid, (error, success) => {
      res.type = 'json'

      if (error) {
        res.status(200).json({ error })
      } else {
        res.status(200).json({ success })
        redisUtility.deleteUser(userid)
        redisUtility.reset(req.sessionID)
      }
    })
  },


  /**
   * 获取用户信息
   */
  getUserInfo: (req, res) => {
    const userid = trim(req.body.userid)

    userOperate.getUserInfo(userid, (error, success) => {
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
   * 获取权限列表
   */
  getRuleList: (req, res) => {
    userOperate.getRuleList((error, success) => {
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
}
