const sequelize = require('sequelize')
const logger = require('../../../common/logger')
const Sys_Notice = require('../../../models/notice/noticeModel')
const Sys_Notice_Detail = require('../../../models/notice/noticeDetailModel')

const dbConn = require('../../../common/dbConn')
const conn = dbConn.getConn()


module.exports = {


    getNoticeById: async (id, callback) => {

        try {
            const data = await Sys_Notice.findOne({
                where: { id },
            }).then((item) => {
                return item;
            });

            return callback(null, data);
        } catch (error) {
            logger.error(`----- noticeOperate getNoticeById error = ${error} -----`);
            return callback('请求已被服务器拒绝');
        }
    },

    noticeCreate: async (noticeCode, noticeType, noticeTypeDesc, noticeIcon, noticeTemplet, noticeParam, callback) => {

        let data = {
            noticeCode,
            noticeType,
            noticeTypeDesc,
            noticeIcon,
            noticeTemplet,
            noticeParam
        };

        try {

            const tepmData = await Sys_Notice.findAll({
                where: {
                    noticeCode,
                    noticeType
                }
            }).then((data) => {
                return data;
            });

            if (tepmData.length > 0) {
                return callback('编码已存在，请重新输入');
            } else {
                const result = await Sys_Notice.create(data).then((result) => {
                    return result;
                })

                return callback(null, '创建成功。');
            }

        } catch (error) {
            logger.error(`----- noticeOperate noticeCreate first try catch error = ${error} -----`);
            return callback('请求已被服务器拒绝');
        }

    },

    noticeEdit: async (id, name, menuLink, comPath, icon, sort, menuType, menuTypeDesc, callback) => {
        try {
            const result = await Sys_Notice.update(
                {
                    noticeCode,
                    noticeType,
                    noticeTypeDesc,
                    noticeIcon,
                    noticeTemplet,
                    noticeParam
                },
                {
                    where: { id },
                }
            ).then((result) => {
                return result;
            })

            return callback(null, '更新成功');
        } catch (error) {
            logger.error(`----- noticeOperate menuEdit error = ${error} -----`);
            return callback('请求已被服务器拒绝');
        }
    },

    //伪删除
    noticeDelete: async (id, callback) => {
        try {
            await Sys_Notice.destroy({
                where: {
                    id
                }
            })
            return callback(null, '删除成功！');

        } catch (error) {
            trans.rollback();

            logger.error(`----- noticeOperate menuDelete try catch error = ${error} -----`);
            return callback('请求已被服务器拒绝');
        }
    }
}