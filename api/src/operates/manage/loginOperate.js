const crypto = require('crypto')
const config = require('../../../config/config')
const logger = require('../../common/logger')

const Rule = require('../../models/ruleModel')
const Rulemap = require('../../models/rulemapModel')
const User = require('../../models/userModel')


User.belongsToMany(Rule, { as: 'rules', through: Rulemap, foreignKey: 'userid', otherKey: 'ruleid' })

module.exports = {
    login: (loginname, _password, callback) => {

        const key = config.secret
        const password = crypto.createHmac('sha1', key).update(_password).digest('hex')

        User.findOne({
            where: {
                loginname,
                password,
                status: '1'
            },
            attributes: ['userid', 'displayname', 'telphone', 'role'],
            include: [{
                model: Rule,
                as: 'rules',
                attributes: ['reveal', 'permission'],
                through: {
                    attributes: []
                }
            }]
        }).then((success) => {
            if (success) {
                return callback(null, success)
            }

            return callback('incorrect')

        }).catch((error) => {
            logger.error(`----- authOperate login error = ${error} -----`)
            return callback('请求已被服务器拒绝')
        })
    },

    // 用户修改密码
    updatePassword: (userid, _expire, _password, callback) => {
        const key = config.secret
        const expire = crypto.createHmac('sha1', key).update(_expire).digest('hex')
        const password = crypto.createHmac('sha1', key).update(_password).digest('hex')

        User.update({
            password
        }, {
                where: {
                    userid,
                    password: expire,
                    status: '1'
                }
            }).then((success) => {
                if (success.length > 0) {
                    if (success[0] === 0) {
                        return callback('用户名或密码错误')
                    }

                    return callback(null, success)
                }

                return callback('用户名或密码错误')
            }).catch((error) => {
                logger.error(`----- authOperate updatePassword error = ${error} -----`)
                return callback('请求已被服务器拒绝')
            })
    },
}
