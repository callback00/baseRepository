const sequelize = require('sequelize')
const dbConn = require('../../common/dbConn')
const conn = dbConn.getConn()

const NoticeDetail = conn.define('sys_notice_detail', {
    id: { type: sequelize.INTEGER, autoIncrement: true, primaryKey: true, unique: true },
    headerId: { type: sequelize.INTEGER, allowNull: false, comment: '表头Id' },
    noticeTitle: { type: sequelize.STRING, allowNull: false, comment: '标题(系统消息才会使用)' },
    noticeContent: { type: sequelize.STRING, allowNull: false, comment: '内容' },
    noticedFlag: { type: sequelize.BOOLEAN, allowNull: false, comment: '是否已通知' },
    readFlag: { type: sequelize.BOOLEAN, allowNull: false, comment: '是否已读(系统消息才会使用)' },
    contact: { type: sequelize.STRING, allowNull: true, comment: '联系人(当为系统消息时，保存userId，当为短信消息时，保存手机号码)' },
    companyId: { type: sequelize.INTEGER, allowNull: false, comment: '公司id' },
}, {
        paranoid: true
    })

module.exports = NoticeDetail
