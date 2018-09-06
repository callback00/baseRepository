const sequelize = require('sequelize')
const moment = require('moment')
const dbConn = require('../common/dbConn')
const conn = dbConn.getConn()

moment.locale('zh-cn')

// 用户表,用于存储前端用户的账号
const Member = conn.define('member', {
  id: { type: sequelize.INTEGER, autoIncrement: true, primaryKey: true, unique: true },
  mobile: { type: sequelize.STRING, defaultValue: null, comment: '手机号' },
  province: { type: sequelize.STRING, defaultValue: null, comment: '手机号省份' },
  city: { type: sequelize.STRING, defaultValue: null, comment: '手机号城市' },
  createdAt: {
    type: sequelize.DATE,
    get() {
      return moment(this.getDataValue('createdAt')).format('YYYY-MM-DD HH:mm:ss');
    }
  }
}, {
    paranoid: true
  })

module.exports = Member
