const moment = require('moment')

const auditOperate = require('../../operates/wx/auditOperate')
moment.locale('zh-cn')

module.exports = {

    getAuditerInfo: (req, res) => {
        const mobile = req.user.mobile;

        auditOperate.getAuditerInfo(mobile, (error, auditer) => {
            if (error) {
                res.status(200).json({ error });
            } else {
                res.status(200).json({ auditer });
            }
        })
    },

    handleAudit: (req, res) => {
        const auditPhone = req.user.mobile;
        const memberPhone = req.body.mobile;

        auditOperate.handleAudit(auditPhone, memberPhone, (error, auditer) => {
            if (error) {
                res.status(200).json({ error });
            } else {
                res.status(200).json({ auditer });
            }
        })
    }
}
