const { parallel } = require('async')
const crypto = require('crypto')

const config = require('../../../config/config')
const dbConn = require('../../common/dbConn')
const logger = require('../../common/logger')

const Rule = require('../../models/ruleModel')
const Rulemap = require('../../models/rulemapModel')
const User = require('../../models/userModel')

const conn = dbConn.getConn()

User.hasMany(Rulemap, { as: 'rulemaps', foreignKey: 'userid' })

module.exports = {
  /**
   * 注册前校验
   */
  userExist: (loginname, callback) => {
    User.findOne({
      where: {
        loginname
      },
      attributes: ['userid', 'displayname']
    }).then((success) => {
      if (success !== null) {
        return callback(null, success)
      }

      return callback('notexist')
    }).catch((error) => {
      logger.error(`----- userOperate userExist error = ${error} -----`)
      return callback('请求已被服务器拒绝')
    })
  },


  /**
   * 创建用户
   */
  createUser: (data, adds, callback) => {
    const key = config.secret
    data.password = crypto.createHmac('sha1', key).update(data.password).digest('hex')

    conn.transaction({
      autocommit: false
    }).then((tran) => {
      User.create(data, {
        transaction: tran
      }).then((success) => {
        const userid = success.userid
        success.password = ''

        const list = []
        adds.forEach((ruleid) => {
          ruleid = Number(ruleid)
          if (Number.isNaN(ruleid) || ruleid < 1) {
            // 什么也不做
          } else {
            list.push({
              userid,
              ruleid,
            })
          }
        })

        Rulemap.bulkCreate(list, {
          transaction: tran
        }).then(() => {
          tran.commit()
          return callback(null, success)
        }).catch((error) => {
          tran.rollback()
          logger.error(`----- userOperate createUser = ${error} -----`)
          return callback('请求已被服务器拒绝')
        })

      }).catch((error) => {
        tran.rollback()
        logger.error(`----- userOperate createUser error = ${error} -----`)
        return callback('请求已被服务器拒绝')
      })
    })
  },


  /**
   * 更新用户信息
   */
  updateUser: (userid, data, adds, deletes, callback) => {
    conn.transaction({
      autocommit: false
    }).then((tran) => {

      parallel({
        user: (_callback) => {
          if (data.password) {
            const key = config.secret
            data.password = crypto.createHmac('sha1', key).update(data.password).digest('hex')
          }

          User.update(data, {
            where: {
              userid
            },
            transaction: tran
          }).then(() => {
            return _callback(null, 'success')
          }).catch((error) => {
            logger.error(`----- userOperate updateUser error = ${error} -----`)
            return _callback(error)
          })
        },

        add: (_callback) => {
          if (!adds || adds.length === 0) {
            return _callback(null, 'success')
          }

          const list = []
          adds.forEach((ruleid) => {
            ruleid = Number(ruleid)
            if (Number.isNaN(ruleid) || ruleid < 1) {
              // 什么也不做
            } else {
              list.push({
                userid,
                ruleid,
              })
            }
          })

          Rulemap.bulkCreate(list, {
            transaction: tran
          }).then(() => {
            return _callback(null, 'success')
          }).catch((error) => {
            logger.error(`----- userOperate updateUser error = ${error} -----`)
            return _callback(error)
          })
        },

        delete: (_callback) => {
          if (!deletes || deletes.length === 0) {
            return _callback(null, 'success')
          }

          Rulemap.destroy({
            where: {
              userid,
              ruleid: {
                $in: deletes
              }
            },
            transaction: tran
          }).then(() => {
            return _callback(null, 'success')
          }).catch((error) => {
            logger.error(`----- userOperate updateUser when find Rulemap, error = ${error} -----`)
            return _callback(error)
          })
        }
      }, (error, success) => {
        if (error) {
          tran.rollback()
          return callback('请求已被服务器拒绝')
        }

        tran.commit()
        return callback(null, success)

      })

    })
  },


  /**
   * 删除用户
   */
  deleteUser: (userid, callback) => {
    if (userid === '0' || userid === 0) {
      return callback('不能删除该用户')
    }

    User.destroy({
      where: {
        userid
      }
    }).then(() => {
      return callback(null, 'success')
    }).catch((error) => {
      logger.error(`----- userOperate deleteUser error = ${error} -----`)
      return callback('请求已被服务器拒绝')
    })
  },


  /**
   * 获取用户信息
   */
  getUserInfo: (userid, callback) => {
    User.findOne({
      where: {
        userid
      },
      attributes: ['userid', 'displayname', 'loginname', 'telphone'],
      include: [{
        model: Rulemap,
        as: 'rulemaps',
        attributes: ['rmid', 'ruleid']
      }]
    }).then((success) => {
      return callback(null, success)
    }).catch((error) => {
      logger.error(`----- userOperate getUserInfo error = ${error} -----`)
      return callback('请求已被服务器拒绝')
    })
  },


  /**
   * 获取用户列表
   */
  getUserList: (pageindex, callback) => {
    const pagesize = 1000
    const offset = pageindex * pagesize

    User.findAll({
      attributes: ['userid', 'displayname', 'loginname', 'telphone'],
      order: 'userid DESC',
      offset,
      limit: pagesize
    }).then((success) => {
      return callback(null, success)
    }).catch((error) => {
      logger.error(`----- userOperate getUserList error = ${error} -----`)
      return callback('请求已被服务器拒绝')
    })
  },


  /**
   * 获取权限列表
   */
  getRuleList: (callback) => {
    Rule.findAll({
      where: {
        ruleid: {
          $gt: 0
        }
      },
      attributes: ['ruleid', 'rulename']
    }).then((success) => {
      return callback(null, success)
    }).catch((error) => {
      logger.error(`----- userOperate getRuleList error = ${error} -----`)
      return callback('请求已被服务器拒绝')
    })
  },


  /**
   * 获取用户名称列表
   */
  getUserName: (pageindex, callback) => {
    const pagesize = 1000
    const offset = pageindex * pagesize

    User.findAll({
      where: {
        $or: [{
          role: '1',
        }, {
          role: '2',
        }]
      },
      attributes: ['userid', 'displayname'],
      order: 'userid',
      offset,
      limit: pagesize
    }).then((success) => {
      return callback(null, success)
    }).catch((error) => {
      logger.error(`----- userOperate getUserName error = ${error} -----`)
      return callback('请求已被服务器拒绝')
    })
  },
}
