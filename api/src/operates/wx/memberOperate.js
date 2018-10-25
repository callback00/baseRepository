const logger = require('../../common/logger')

const Member = require('../../models/memberModel')

module.exports = {
    /**
     * 微信app用户登录
     */
    getMemberInfoByMobile: (mobile, callback) => {
        Member.findOne({
            where: {
                mobile
            }
        }).then((member) => {
            if (member) {
                callback(null, member)
            } else {
                callback('该二维码用户不存在，请告知旅客注册')
            }
        }).catch((error) => {
            logger.error(`----- memberOperate getMemberInfoByMobile error = ${error} -----`)
            return callback('请求已被服务器拒绝')
        })
    },
}
