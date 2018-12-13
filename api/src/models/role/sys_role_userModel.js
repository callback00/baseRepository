const sequelize = require('sequelize')
const moment = require('moment')
const dbConn = require('../../common/dbConn')
const conn = dbConn.getConn()

moment.locale('zh-cn')

// api的权限控制是否分组织还需要考虑，目前未加组织id
const Sys_Role_User = conn.define('sys_role_user', {
    id: { type: sequelize.INTEGER, autoIncrement: true, primaryKey: true, unique: true },

    userId: { type: sequelize.INTEGER, allowNull: false, comment: '用户id' },
    loginName: { type: sequelize.STRING, allowNull: false, comment: '登录名或者编码' },
    userName: { type: sequelize.STRING, allowNull: false, comment: '用户名称' },
    roleId: { type: sequelize.INTEGER, allowNull: false, comment: '' },
    roleName: { type: sequelize.STRING, allowNull: false, comment: 'api名称' }
}, {
        paranoid: true
    })

module.exports = Sys_Role_User
