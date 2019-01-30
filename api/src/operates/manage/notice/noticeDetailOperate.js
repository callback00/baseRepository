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

    sendNotice: async (noticeCode, noticeType, noticeParamData, companyId, callback) => {

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
                    headerId: header.id,
                    noticeTitle: noticeParamData.noticeTitle,
                    contact: noticeParamData.contact,
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
            logger.error(`----- noticeDetailOperate sendNotice first try catch error = ${error} -----`);
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
                    contact: userId
                },
                order: [
                    ['createdAt', 'asc']
                ]
            }).then((list) => {
                return list;
            });

            const unReadMsgCount = await conn.query(
                `select count(A.id) as unReadCount from sys_notice_details A inner join sys_notices B on (A.headerId = B.id)
                 where A.deletedAt is null and A.contact=${userId} and A.readFlag = 0 and B.noticeType = 1
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
}
