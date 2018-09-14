const crypto = require('crypto')
const config = require('../../../config/config')
const logger = require('../../common/logger')

const Rule = require('../../models/ruleModel')
const Rulemap = require('../../models/rulemapModel')
const User = require('../../models/userModel')
const Sys_Menu_Permission = require('../../models/system/sys_menu_permission')
const Menu = require('../../models/system/menuModel')

// User.belongsToMany(Rule, { as: 'rules', through: Rulemap, foreignKey: 'userId', otherKey: 'ruleid' })

User.belongsToMany(Menu, { as: 'Menus', through: Sys_Menu_Permission, foreignKey: 'userId', otherKey: 'menuId' })

module.exports = {
    login_OLD: (loginName, _password, callback) => {

        const key = config.secret
        const password = crypto.createHmac('sha1', key).update(_password).digest('hex')

        User.findOne({
            where: {
                loginName,
                password,
                status: '1'
            },
            attributes: ['userId', 'displayName', 'telphone', 'role'],
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

    login: (loginName, _password, callback) => {

        const key = config.secret
        const password = crypto.createHmac('sha1', key).update(_password).digest('hex')

        User.findOne({
            where: {
                loginName,
                password,
                status: '1'
            },
            attributes: ['userId', 'displayName', 'telphone'],
            include: [{
                model: Menu,
                as: 'Menus',
                through: {
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
    updatePassword: (userId, _expire, _password, callback) => {
        const key = config.secret
        const expire = crypto.createHmac('sha1', key).update(_expire).digest('hex')
        const password = crypto.createHmac('sha1', key).update(_password).digest('hex')

        User.update({
            password
        }, {
                where: {
                    userId,
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
