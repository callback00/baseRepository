const sequelize = require('sequelize')
const dbConn = require('../../common/dbConn')
const conn = dbConn.getConn()
const moment = require('moment')

// 该数据库表与 sys_notice 无主外键关系
const NoticeDetail = conn.define('sys_notice_detail', {
    id: { type: sequelize.INTEGER, autoIncrement: true, primaryKey: true, unique: true },

    // 注意，这里的noticeType与noticeModel的不同，多了一个 '客户消息'
    noticeType: { type: sequelize.ENUM, allowNull: false, values: ['1', '2', '3'], defaultValue: '1', comment: '通知类型: 1. 系统消息 2. 短信消息 3. 客户消息' },
    noticeTypeDesc: { type: sequelize.STRING, allowNull: true, comment: '类型描述' },

    noticeTitle: { type: sequelize.STRING, allowNull: true, comment: '标题(短信消息可空)' },
    noticeContent: { type: sequelize.STRING, allowNull: false, comment: '内容' },

    sender: { type: sequelize.STRING, allowNull: true, comment: '消息发送者(当类型为系统消息时，保存userId，当类型为短信消息时，保存发送者手机号码，客户消息时则记录memberId)' },
    senderName: { type: sequelize.STRING, allowNull: true, comment: '消息发送者姓名(可空)' },

    noticedFlag: { type: sequelize.BOOLEAN, allowNull: false, comment: '是否已通知' },
    readFlag: { type: sequelize.BOOLEAN, allowNull: false, comment: '是否已读' },
    contact: { type: sequelize.STRING, allowNull: true, comment: '消息接收者唯一标识(当为系统消息时，保存userId，当为短信消息时，保存手机号码，当为客户消息时，保存指定的客服userId)' },
    companyId: { type: sequelize.INTEGER, allowNull: false, comment: '公司id' },
    createdAt: {
        type: sequelize.DATE,
        get() {
            return moment(this.getDataValue('createdAt')).format('YYYY-MM-DD HH:mm:ss');
        }
    }
}, {
        paranoid: true
    })

module.exports = NoticeDetail
