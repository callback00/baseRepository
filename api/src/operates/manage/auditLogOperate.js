const logger = require('../../common/logger')
const AuditLog = require('../../models/auditLogModel')

module.exports = {
    getAuditLogList: (auditPhone, workAreaName, memberPhone, province, city, startTime, endTime, callback) => {

        const condition = [
            { auditPhone: { $like: `%${auditPhone}%` } },
            { workAreaName: { $like: `%${workAreaName}%` } },
            { memberPhone: { $like: `%${memberPhone}%` } },
            { province: { $like: `%${province}%` } },
            { city: { $like: `%${city}%` } }
        ]

        if (startTime && endTime) {
            condition.push({
                createdAt: { $gte: startTime }
            });
            condition.push({
                createdAt: { $lte: endTime }
            })
        }

        AuditLog.findAll({
            where: {
                $and: condition
            },
        }).then((success) => {
            return callback(null, success)
        }).catch((error) => {
            logger.error(`----- auditLogOperate getAuditLogList error = ${error} -----`)
            return callback('请求已被服务器拒绝')
        })
    },

}
