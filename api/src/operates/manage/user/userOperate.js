const { parallel } = require('async')
const crypto = require('crypto')

const config = require('../../../../config/config')
const dbConn = require('../../../common/dbConn')
const logger = require('../../../common/logger')

const User = require('../../../models/userModel')

const conn = dbConn.getConn()

module.exports = {
    /**
     * 注册前校验
     */
    userExist: (loginName, companyId, callback) => {
        User.findOne({
            where: {
                loginName,
                companyId
            },
            attributes: ['userId', 'displayName']
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
    createUser: (data, callback) => {
        const key = config.secret
        data.password = crypto.createHmac('sha1', key).update(data.password).digest('hex')

        conn.transaction({
            autocommit: false
        }).then((tran) => {
            User.create(data, {
                transaction: tran
            }).then((success) => {
                const userId = success.userId
                success.password = ''

                tran.commit()
                return callback(null, success)

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
    updateUser: (userId, data, callback) => {
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
                            userId
                        },
                        transaction: tran
                    }).then(() => {
                        return _callback(null, 'success')
                    }).catch((error) => {
                        logger.error(`----- userOperate updateUser error = ${error} -----`)
                        return _callback(error)
                    })
                },
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
    deleteUser: (userId, callback) => {
        if (userId === '0' || userId === 0) {
            return callback('不能删除该用户')
        }

        User.destroy({
            where: {
                userId
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
    getUserInfo: (userId, callback) => {
        User.findOne({
            where: {
                userId
            },
            attributes: ['userId', 'displayName', 'loginName', 'telphone'],
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
    getUserList: (pageindex, companyId, callback) => {
        const pagesize = 1000
        const offset = pageindex * pagesize

        User.findAll({
            where: { loginname: { $ne: 'admin' }, companyId },
            attributes: ['userId', 'displayName', 'loginName', 'telphone'],
            order: 'userId DESC',
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
     * 获取用户名称列表
     */
    getUserName: (pageindex, companyId, callback) => {
        const pagesize = 1000
        const offset = pageindex * pagesize

        User.findAll({
            where: {
                companyId,
                $or: [{
                    role: '1',
                }, {
                    role: '2',
                }]
            },
            attributes: ['userId', 'displayName'],
            order: 'userId',
            offset,
            limit: pagesize
        }).then((success) => {
            return callback(null, success)
        }).catch((error) => {
            logger.error(`----- userOperate getUserName error = ${error} -----`)
            return callback('请求已被服务器拒绝')
        })
    },

    getMyInfo: (userId, callback) => {
        User.findOne({
            where: {
                userId
            }
        }).then((success) => {
            return callback(null, success)
        }).catch((error) => {
            logger.error(`----- userOperate getMyInfo error = ${error} -----`)
            return callback('请求已被服务器拒绝')
        })
    },

    updateMyInfo: (userId, data, callback) => {
        User.update(data, {
            where: {
                userId
            }
        }).then(() => {
            return callback(null, 'success')
        }).catch((error) => {
            logger.error(`----- userOperate updateMyInfo error = ${error} -----`)
            return callback(error)
        })
    }
}
