const { trim } = require('lodash')
const noticeOperate = require('../../../operates/manage/notice/noticeOperate')

module.exports = {

    getNoticeList: (req, res) => {
        const companyId = req.user.company.id;

        noticeOperate.getNoticeList(companyId, (error, success) => {
            res.type = 'json';

            if (error) {
                res.status(200).json({ error });
            } else {
                res.status(200).json({ success });
            }
        })
    },

    getNoticeById: (req, res) => {
        const id = req.body.id
        noticeOperate.getNoticeById(id, (error, success) => {
            res.type = 'json';

            if (error) {
                res.status(200).json({ error });
            } else {
                res.status(200).json({ success });
            }
        })
    },

    noticeCreate: (req, res) => {
        const noticeCode = trim(req.body.noticeCode);
        const noticeName = trim(req.body.noticeName);
        const noticeType = trim(req.body.noticeType);
        const noticeTypeDesc = noticeType === '1' ? '系统消息' : '短信消息'
        const noticeIcon = trim(req.body.noticeIcon);
        const noticeTemplet = trim(req.body.noticeTemplet);

        const defaultParam = []
        const templetParam = trim(req.body.templetParam) ? trim(req.body.templetParam) : JSON.stringify(defaultParam);

        const companyId = req.user.company.id;

        res.type = 'json';
        noticeOperate.noticeCreate(noticeCode, noticeName, noticeType, noticeTypeDesc, noticeIcon, noticeTemplet, templetParam, companyId, (error, success) => {

            if (error) {
                res.status(200).json({ error });
            } else {
                res.status(200).json({ success });
            }
        })
    },

    noticeEdit: (req, res) => {
        const id = trim(req.body.id);
        const noticeName = trim(req.body.noticeName);
        const noticeType = trim(req.body.noticeType);
        const noticeTypeDesc = noticeType === '1' ? '系统消息' : '短信消息'
        const noticeIcon = trim(req.body.noticeIcon);
        const noticeTemplet = trim(req.body.noticeTemplet);
        const templetParam = trim(req.body.templetParam);

        res.type = 'json';
        noticeOperate.noticeEdit(id, noticeName, noticeType, noticeTypeDesc, noticeIcon, noticeTemplet, templetParam, (error, success) => {

            if (error) {
                res.status(200).json({ error });
            } else {
                res.status(200).json({ success });
            }
        })
    },

    noticeDelete: (req, res) => {
        const id = req.body.id;

        res.type = 'json'
        noticeOperate.noticeDelete(id, (error, success) => {

            if (error) {
                res.status(200).json({ error });
            } else {
                res.status(200).json({ success });
            }
        })
    },
}
