const crypto = require('crypto')
const config = require('../../../../config/config')
const logger = require('../../../common/logger')

const Member = require('../../../models/memberModel')

module.exports = {
    getMemberList: (mobile, province, city, callback) => {
        Member.findAll({
            where: {
                $and: [
                    { mobile: { $like: `%${mobile}%` } },
                    { province: { $like: `%${province}%` } },
                    { city: { $like: `%${city}%` } }
                ]
            },
        }).then((success) => {
            return callback(null, success)
        }).catch((error) => {
            logger.error(`----- memberOperate getMemberList error = ${error} -----`)
            return callback('请求已被服务器拒绝')
        })
    },

}
