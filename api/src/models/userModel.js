const sequelize = require('sequelize')
const dbConn = require('../common/dbConn')
const conn = dbConn.getConn()

// 系统用户表,用于存储后台操作人员的账号
const User = conn.define('sys_user', {
  userid: { type: sequelize.INTEGER, autoIncrement: true, primaryKey: true, unique: true },

  loginname: { type: sequelize.STRING, allowNull: false, comment: '登录名' },
  displayname: { type: sequelize.STRING, allowNull: false, comment: '昵称' },
  password: { type: sequelize.STRING, defaultValue: null, comment: '密码' },
  telphone: { type: sequelize.STRING, defaultValue: null, comment: '电话' },
  avatar: { type: sequelize.STRING, defaultValue: null, comment: '个人头像url' },

  gender: { type: sequelize.ENUM, values: ['0', '1'], defaultValue: '1', comment: '0.女 1.男' },
  remarks: { type: sequelize.STRING, defaultValue: null, comment: '备注' },
  status: { type: sequelize.ENUM, values: ['0', '1'], defaultValue: '1', comment: '账号状态: 0.锁定 1.正常' },
  role: { type: sequelize.ENUM, values: ['0', '1', '2'], defaultValue: '1', comment: '角色: 0.管理员 1.立案庭 2.审判庭' },
}, {
  paranoid: true
})

module.exports = User
