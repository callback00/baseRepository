const { trim } = require('lodash')
const workAreaAuditerOperate = require('../../operates/manage/workAreaAuditerOperate')

module.exports = {
    //获取会员列表
    getWorkAreaTree: (req, res) => {
        workAreaAuditerOperate.getWorkAreaTree((error, success) => {
            res.type = 'json';

            if (error) {
                res.status(200).json({ error });
            } else {
                res.status(200).json({ success });
            }
        })
    },

    getWorkAreaById: (req, res) => {
        const id = req.body.id
        workAreaAuditerOperate.getWorkAreaById(id, (error, success) => {
            res.type = 'json';

            if (error) {
                res.status(200).json({ error });
            } else {
                res.status(200).json({ success });
            }
        })
    },

    workAreaCreate: (req, res) => {
        const name = trim(req.body.name)
        const parentid = trim(req.body.parentid)
        const sort = trim(req.body.sort)

        res.type = 'json'
        workAreaAuditerOperate.workAreaCreate(name, parentid, sort, (error, success) => {

            if (error) {
                res.status(200).json({ error })
            } else {
                res.status(200).json({ success })
            }
        })
    },

    workAreaEdit: (req, res) => {
        const id = trim(req.body.id)
        const name = trim(req.body.name)
        const sort = trim(req.body.sort)

        res.type = 'json'
        workAreaAuditerOperate.workAreaEdit(id, name, sort, (error, success) => {

            if (error) {
                res.status(200).json({ error })
            } else {
                res.status(200).json({ success })
            }
        })
    },

    workAreaDelete: (req, res) => {
        const id = trim(req.body.id)

        res.type = 'json'
        workAreaAuditerOperate.workAreaDelete(id, (error, success) => {

            if (error) {
                res.status(200).json({ error })
            } else {
                res.status(200).json({ success })
            }
        })
    },

    workAreaAuditerCreate: (req, res) => {
        const auditName = trim(req.body.auditName)
        const auditPhone = trim(req.body.auditPhone)
        const waid = trim(req.body.waid)

        res.type = 'json'
        workAreaAuditerOperate.workAreaAuditerCreate(auditName, auditPhone, waid, (error, success) => {

            if (error) {
                res.status(200).json({ error })
            } else {
                res.status(200).json({ success })
            }
        })
    },

    workAreaAuditerEdit: (req, res) => {
        const id = trim(req.body.id)
        const auditName = trim(req.body.auditName)

        res.type = 'json'
        workAreaAuditerOperate.workAreaAuditerEdit(id, auditName, (error, success) => {

            if (error) {
                res.status(200).json({ error })
            } else {
                res.status(200).json({ success })
            }
        })
    },

    workAreaAuditerDelete: (req, res) => {
        const id = trim(req.body.id)

        res.type = 'json'
        workAreaAuditerOperate.workAreaAuditerDelete(id, (error, success) => {

            if (error) {
                res.status(200).json({ error })
            } else {
                res.status(200).json({ success })
            }
        })
    },

    getAuditerListByAreaId: (req, res) => {
        const waid = req.body.waid

        res.type = 'json'
        workAreaAuditerOperate.getAuditerListByAreaId(waid, (error, success) => {

            if (error) {
                res.status(200).json({ error })
            } else {
                res.status(200).json({ success })
            }
        })
    },

    getAuditerById: (req, res) => {
        const id = trim(req.body.id)

        res.type = 'json'
        workAreaAuditerOperate.getAuditerById(id, (error, success) => {

            if (error) {
                res.status(200).json({ error })
            } else {
                res.status(200).json({ success })
            }
        })
    }
}
