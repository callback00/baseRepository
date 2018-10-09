const { trim } = require('lodash')
const noticeOperate = require('../../../operates/manage/notice/noticeOperate')

module.exports = {

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
        const noticeType = trim(req.body.noticeType);
        const noticeTypeDesc = trim(req.body.noticeTypeDesc);
        const noticeIcon = trim(req.body.noticeIcon);
        const noticeTemplet = trim(req.body.noticeTemplet);
        const noticeParam = trim(req.body.noticeParam);

        res.type = 'json';
        noticeOperate.noticeCreate(noticeCode, noticeType, noticeTypeDesc, noticeIcon, noticeTemplet, noticeParam, (error, success) => {

            if (error) {
                res.status(200).json({ error });
            } else {
                res.status(200).json({ success });
            }
        })
    },

    noticeEdit: (req, res) => {
        const id = trim(req.body.id);
        const noticeType = trim(req.body.noticeType);
        const noticeTypeDesc = trim(req.body.noticeTypeDesc);
        const noticeIcon = trim(req.body.noticeIcon);
        const noticeTemplet = trim(req.body.noticeTemplet);
        const noticeParam = trim(req.body.noticeParam);

        res.type = 'json';
        noticeOperate.noticeEdit(id, noticeType, noticeTypeDesc, noticeIcon, noticeTemplet, noticeParam, (error, success) => {

            if (error) {
                res.status(200).json({ error });
            } else {
                res.status(200).json({ success });
            }
        })
    },

    noticeDelete: (req, res) => {
        const idArry = req.body.idArry ? JSON.parse(req.body.idArry) : [];

        res.type = 'json'
        noticeOperate.noticeDelete(idArry, (error, success) => {

            if (error) {
                res.status(200).json({ error });
            } else {
                res.status(200).json({ success });
            }
        })
    },
}
