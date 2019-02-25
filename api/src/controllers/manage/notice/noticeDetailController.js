const { trim } = require('lodash')
const noticeDetailOperate = require('../../../operates/manage/notice/noticeDetailOperate')
const bussinessConfig = require('../../../../config/bussinessConfig')

module.exports = {

    // 未使用
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
     * sendTemplateNoticeDetail，该方法仅将数据保存到数据库中，具体的发送逻辑不在此处.
     * 该方法只用于发送消息模板的消息，客户消息不能使用该方法发送(客户消息暂时还没有使用)
     * @param {string} noticeCode - 消息模板编码.
     * @param {string} noticeType - 消息模板类型.
     * @param {string} noticeData - 这是一个对象，具体参数使用请参考消息管理中的使用教程。
     */
    sendTemplateNoticeDetail: (req, res) => {
        const noticeCode = trim(req.body.noticeCode);
        const noticeType = trim(req.body.noticeType);
        const noticeParamData = req.body.noticeParamData;
        const companyId = req.user.company.id

        let sender = null
        if (noticeType === '1') {
            sender = req.user
        } else if (noticeType === '2') {
            sender = {
                phone: bussinessConfig.systemPhone,
                name: bussinessConfig.systemPhoneName
            }

        } else {
            res.status(200).json({ error: '传递的消息模板类型不正确，该接口只适用于发送模板消息' });
            return
        }

        res.type = 'json';
        noticeDetailOperate.sendTemplateNoticeDetail(noticeCode, noticeType, noticeParamData, companyId, sender, (error, success) => {
            if (error) {
                res.status(200).json({ error });
            } else {
                res.status(200).json({ success });
            }
        })
    },

    getUserUnReadNoticeList: (req, res) => {
        const userId = req.user.userId

        res.type = 'json';
        noticeDetailOperate.getUserUnReadNoticeList(userId, (error, success) => {
            if (error) {
                res.status(200).json({ error });
            } else {
                res.status(200).json({ success });
            }
        })
    },

    getUserAllNoticeList: (req, res) => {
        const userId = req.user.userId

        res.type = 'json';
        noticeDetailOperate.getUserAllNoticeList(userId, (error, success) => {
            if (error) {
                res.status(200).json({ error });
            } else {
                res.status(200).json({ success });
            }
        })
    },

    updateReadFlag: (req, res) => {
        const id = req.body.id

        res.type = 'json';
        noticeDetailOperate.updateReadFlag(id, (error, success) => {
            if (error) {
                res.status(200).json({ error });
            } else {
                res.status(200).json({ success });
            }
        })
    },
}
