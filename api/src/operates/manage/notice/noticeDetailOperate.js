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

    sendNotice: async (noticeCode, noticeType, noticeParamData, callback) => {

        try {

            const header = await Sys_Notice.findOne({
                where: {
                    noticeCode,
                    noticeType
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
                    mobile: noticeParamData.mobile,
                    noticeContent,
                    noticedFlag: false,
                    readFlag: false,
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


}
