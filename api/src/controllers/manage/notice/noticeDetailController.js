const { trim } = require('lodash')
const noticeDetailOperate = require('../../../operates/manage/notice/noticeDetailOperate')

module.exports = {

    getNoticeDetailByHeaderId: (req, res) => {
        const id = req.body.id
        noticeDetailOperate.getNoticeDetailByHeaderId(id, (error, success) => {
            res.type = 'json';

            if (error) {
                res.status(200).json({ error });
            } else {
                res.status(200).json({ success });
            }
        })
    },

    /**
     * sendNoticeDetail，该方法仅将数据保存到数据库中，具体的发送逻辑不在此处.
     * @param {string} noticeCode - 消息模板编码.
     * @param {string} noticeType - 消息模板类型.
     * @param {string} noticeData - 这是一个对象，具体参数使用请参考消息管理中的使用教程。
     */
    sendNoticeDetail: (req, res) => {
        const noticeCode = trim(req.body.noticeCode);
        const noticeType = trim(req.body.noticeType);
        const noticeParamData = req.body.noticeParamData;
        const companyId = req.user.company.id

        res.type = 'json';
        noticeDetailOperate.sendNotice(noticeCode, noticeType, noticeParamData, companyId, (error, success) => {
            if (error) {
                res.status(200).json({ error });
            } else {
                res.status(200).json({ success });
            }
        })
    },
}
