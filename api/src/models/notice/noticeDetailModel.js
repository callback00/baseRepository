const sequelize = require('sequelize')
const dbConn = require('../../common/dbConn')
const conn = dbConn.getConn()

const NoticeDetail = conn.define('sys_notice_detail', {
    id: { type: sequelize.INTEGER, autoIncrement: true, primaryKey: true, unique: true },
    headerId: { type: sequelize.INTEGER, allowNull: false, comment: '表头Id' },
    noticeTitle: { type: sequelize.STRING, allowNull: false, comment: '标题' },
    noticeContent: { type: sequelize.STRING, allowNull: false, comment: '内容' },
    noticedFlag: { type: sequelize.BOOLEAN, allowNull: false, comment: '是否已通知' },
    readFlag: { type: sequelize.BOOLEAN, allowNull: false, comment: '是否已读' },
}, {
        paranoid: true
    })

module.exports = NoticeDetail
