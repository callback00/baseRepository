const { trim } = require('lodash')

const redisUtility = require('../../common/redisUtility')
const memberOperate = require('../../operates/manage/memberOperate')

module.exports = {
    //获取会员列表
    getMemberList: (req, res) => {
        const mobile = trim(req.body.mobile);
        const province = trim(req.body.province);
        const city = trim(req.body.city);

        memberOperate.getMemberList(mobile, province, city, (error, success) => {
            res.type = 'json';

            if (error) {
                res.status(200).json({ error });
            } else {
                res.status(200).json({ success });
                const key = redisUtility.createKey(req.originalUrl, req.body);
                redisUtility.setCache(req.sessionID, key, success);
            }
        })
    },
}
