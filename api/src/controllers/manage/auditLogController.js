const { trim } = require('lodash')

const auditLogOperate = require('../../operates/manage/auditLogOperate')

module.exports = {
    //获取会员列表
    getAuditLogList: (req, res) => {
        const auditPhone = trim(req.body.auditPhone);
        const workAreaName = trim(req.body.workAreaName);
        const memberPhone = trim(req.body.memberPhone);
        const province = trim(req.body.province);
        const city = trim(req.body.city);
        const startTime = trim(req.body.startTime);
        const endTime = trim(req.body.endTime);

        auditLogOperate.getAuditLogList(auditPhone, workAreaName, memberPhone, province, city, startTime, endTime, (error, success) => {
            res.type = 'json';

            if (error) {
                res.status(200).json({ error });
            } else {
                res.status(200).json({ success });
            }
        })
    },
}
