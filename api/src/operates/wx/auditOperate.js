const logger = require('../../common/logger')

const WorkAreaAuditer = require('../../models/workAreaAuditerModel')
const AuditLog = require('../../models/auditLogModel')
const Member = require('../../models/memberModel')

module.exports = {
    /**
     * 微信app用户登录
     */
    getAuditerInfo: (mobile, callback) => {
        WorkAreaAuditer.findOne({
            where: {
                auditPhone: mobile
            }
        }).then((auditer) => {
            if (auditer) {
                callback(null, auditer)
            } else {
                callback('您无权操作此页面')
            }
        }).catch((error) => {
            logger.error(`----- auditOperate getAuditerInfo error = ${error} -----`)
            return callback('请求已被服务器拒绝')
        })
    },

    handleAudit: (auditPhone, memberPhone, callback) => {
        WorkAreaAuditer.findOne({
            where: {
                auditPhone
            }
        }).then((auditer) => {
            if (auditer) {

                Member.findOne({
                    where: {
                        mobile: memberPhone
                    }
                }).then((member) => {
                    const data = {
                        auditPhone: auditer.auditPhone,
                        auditName: auditer.auditName,
                        waid: auditer.waid,
                        workAreaName: auditer.workAreaName,
                        treeid: auditer.treeid,
                        memberPhone,
                        province: member ? member.province : '',
                        city: member ? member.city : ''
                    }
                    AuditLog.create(data).then((success) => {
                        return callback(null, '操作成功')
                    })
                })
            } else {
                return callback('您无权操作此页面')
            }
        }).catch((error) => {
            logger.error(`----- auditOperate handleAudit error = ${error} -----`)
            return callback('请求已被服务器拒绝')
        })
    },
}
