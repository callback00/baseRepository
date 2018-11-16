const sequelize = require('sequelize')
const dbConn = require('../../common/dbConn')
const conn = dbConn.getConn()

const Notice = conn.define('sys_notice', {
  id: { type: sequelize.INTEGER, autoIncrement: true, primaryKey: true, unique: true },
  noticeCode: { type: sequelize.STRING, allowNull: false, comment: '模板代号' },
  noticeName: { type: sequelize.STRING, allowNull: false, comment: '消息模板名称' },

  noticeType: { type: sequelize.ENUM, allowNull: false, values: ['1', '2'], defaultValue: '1', comment: '通知类型: 1. 系统消息 2. 短信消息' },
  noticeTypeDesc: { type: sequelize.STRING, allowNull: true, comment: '类型描述' },
  noticeIcon: { type: sequelize.STRING, allowNull: true, comment: '通知图标' },
  noticeTemplet: { type: sequelize.STRING, allowNull: true, comment: '消息模板' },
  templetParam: { type: sequelize.STRING, allowNull: true, comment: '模板参数' },
  companyId: { type: sequelize.INTEGER, allowNull: false, comment: '公司id' },
}, {
    paranoid: true
  })

module.exports = Notice
