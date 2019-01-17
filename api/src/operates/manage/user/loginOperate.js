const crypto = require('crypto')
const config = require('../../../../config/config')
const logger = require('../../../common/logger')

const Company = require('../../../models/system/sys_companyModel')
const User = require('../../../models/userModel')
const Sys_Api_Permission = require('../../../models/system/sys_api_permission')
const Api = require('../../../models/system/apiModel')

const sequelize = require('sequelize')
const dbConn = require('../../../common/dbConn')
const conn = dbConn.getConn()

module.exports = {
    login: (loginName, _password, companyId, callback) => {

        const key = config.secret
        const password = crypto.createHmac('sha1', key).update(_password).digest('hex')

        User.findOne({
            where: {
                loginName,
                password,
                status: '1',
                companyId
            },
            attributes: ['userId', 'loginName', 'displayName', 'telphone'],
        }).then((user) => {
            if (user) {

                // 获取api权限
                conn.query(
                    `select Api.* from (
                        select B.apiId,B.apiName from sys_role_users A inner join sys_role_api_permissions B on A.roleId = B.roleId where A.userId = ${user.userId}
                        UNION 
                        select apiId,apiName from sys_api_permissions where userId = ${user.userId}
                        ) tempData inner join sys_apis as Api on tempData.apiId = Api.id`
                    , { type: sequelize.QueryTypes.SELECT }
                ).then((result) => {
                    user.Apis = result;

                    Company.findOne({
                        where: {
                            id: companyId
                        },
                        attributes: ['id', 'name', 'parentId', 'treeId']
                    }).then((company) => {
                        return callback(null, user, company)
                    })
                })
            } else {
                return callback('incorrect')
            }

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
