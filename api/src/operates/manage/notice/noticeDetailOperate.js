const sequelize = require('sequelize')
const logger = require('../../../common/logger')
const Sys_Notice = require('../../../models/notice/noticeModel')
const Sys_Notice_Detail = require('../../../models/notice/noticeDetailModel')

const dbConn = require('../../../common/dbConn')
const conn = dbConn.getConn()


module.exports = {


    getNoticeDetailByHeaderId: async (headerId, callback) => {

        try {
            const data = await Sys_Notice_Detail.findAll({
                where: { headerId },
            }).then((list) => {
                return list;
            });

            return callback(null, data);
        } catch (error) {
            logger.error(`----- noticeDetailOperate getNoticeDetailByHeaderId error = ${error} -----`);
            return callback('请求已被服务器拒绝');
        }
    },

    /**
     * sendTemplateNoticeDetail，该方法仅将数据保存到数据库中，具体的发送逻辑不在此处.
     * 该方法只用于发送消息模板的消息，客户消息不能使用该方法发送(客户消息暂时还没有使用)
     * @param {string} noticeCode - 消息模板编码.
     * @param {string} noticeType - 消息模板类型.
     * @param {string} noticeParamData - 这是一个对象，具体参数使用请参考消息管理中的使用教程。
     * @param {int} companyId - 所属组织id
     * @param {object or int} sender - 发送者(当为系统消息时传递当前user,当为短信时传递发送者手机号码)
     * @param {function} callback - 回调函数
     */
    sendTemplateNoticeDetail: async (noticeCode, noticeType, noticeParamData, companyId, sender, callback) => {

        try {

            const header = await Sys_Notice.findOne({
                where: {
                    noticeCode,
                    noticeType,
                    companyId
                }
            }).then((item) => {
                return item;
            });

            if (!header) {
                return callback('消息模板不存在，请检查参数。');
            } else {

                let noticeContent = header.noticeTemplet;

                if (header.templetParam) {
                    const templetParam = JSON.parse(header.templetParam);

                    templetParam.forEach(param => {
                        noticeContent = noticeContent.replace(`{${param}}`, noticeParamData.templetParam[param])
                    });
                }

                let data = {
                    noticeType: header.noticeType,
                    noticeTypeDesc: header.noticeTypeDesc,
                    noticeTitle: noticeParamData.noticeTitle,
                    contact: noticeParamData.contact,
                    sender: noticeType === '1' ? sender.userId : sender.phone,
                    senderName: noticeType === '1' ? sender.displayName : sender.name,
                    noticeContent,
                    noticedFlag: false,
                    readFlag: false,
                    companyId,
                };

                const result = await Sys_Notice_Detail.create(data).then((result) => {
                    return result;
                })

                return callback(null, '创建成功。');
            }

        } catch (error) {
            logger.error(`----- noticeDetailOperate sendTemplateNoticeDetail first try catch error = ${error} -----`);
            return callback('请求已被服务器拒绝');
        }

    },

    // 获取用户系统消息，不需要提供api，内部调用
    getUserWebNoticeList: async (userId, callback) => {

        try {
            const data = await Sys_Notice_Detail.findAll({
                limit: 5,
                where: {
                    noticedFlag: '0',
                    contact: userId,
                    noticeType: { $ne: '2' }
                },
                order: [
                    ['createdAt', 'asc']
                ]
            }).then((list) => {
                return list;
            });

            const unReadMsgCount = await conn.query(
                `select count(A.id) as unReadCount from sys_notice_details A
                 where A.deletedAt is null and A.contact=${userId} and A.readFlag = 0 and A.noticeType != 2
            `, { type: sequelize.QueryTypes.SELECT }
            ).then((result) => {
                return result[0].unReadCount;
            })

            const idArry = [];
            data.forEach(item => {
                idArry.push(item.id)
            });

            const result = {
                data,
                unReadMsgCount,
                idArry
            }
            return callback(null, result);
        } catch (error) {
            logger.error(`----- noticeDetailOperate getUserWebNoticeList error = ${error} -----`);
            return callback('请求已被服务器拒绝');
        }
    },

    // 将通知未通知状态改为已通知
    updateNoticeListNoticedFlag: async (idArry) => {

        try {
            if (idArry.length > 0) {
                conn.query(
                    ` update  sys_notice_details set noticedFlag = 1 where id in (${idArry})`
                    , { type: sequelize.QueryTypes.UPDATE }
                )
            }
        } catch (error) {
            logger.error(`----- noticeDetailOperate getUserWebNoticeList error = ${error} -----`);
        }
    },

    getUserUnReadNoticeList: async (userId, callback) => {

        try {
            const data = await Sys_Notice_Detail.findAll({
                limit: 5,
                where: {
                    noticedFlag: '1',
                    readFlag: '0',
                    contact: userId
                },
                order: [
                    ['createdAt', 'desc']
                ]
            }).then((list) => {
                return list;
            });

            const result = {
                data
            }
            return callback(null, result);
        } catch (error) {
            logger.error(`----- noticeDetailOperate getUserUnReadNoticeList error = ${error} -----`);
            return callback('请求已被服务器拒绝');
        }
    },

    getUserAllNoticeList: async (userId, callback) => {

        try {
            const data = await Sys_Notice_Detail.findAll({
                where: {
                    contact: userId,
                    noticeType: { $ne: '2' }
                },
                order: [
                    ['createdAt', 'desc']
                ]
            }).then((list) => {
                return list;
            });

            const unReadMsgCount = await conn.query(
                `select count(A.id) as unReadCount from sys_notice_details A 
                 where A.deletedAt is null and A.contact=${userId} and A.readFlag = 0 and A.noticeType != 2
            `, { type: sequelize.QueryTypes.SELECT }
            ).then((result) => {
                return result[0].unReadCount;
            })

            const result = {
                data,
                unReadMsgCount
            }
            return callback(null, result);
        } catch (error) {
            logger.error(`----- noticeDetailOperate getUserAllNoticeList error = ${error} -----`);
            return callback('请求已被服务器拒绝');
        }
    },

    updateReadFlag: async (id, callback) => {

        try {
            const result = await Sys_Notice_Detail.update(
                {
                    readFlag: true
                },
                {
                    where: { id },
                }
            ).then((result) => {
                return result;
            })

            return callback(null, result);

        } catch (error) {
            logger.error(`----- noticeDetailOperate updateReadFlag error = ${error} -----`);
            return callback('请求已被服务器拒绝');
        }
    },
}
