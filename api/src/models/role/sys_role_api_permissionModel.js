const sequelize = require('sequelize')
const moment = require('moment')
const dbConn = require('../../common/dbConn')
const conn = dbConn.getConn()

moment.locale('zh-cn')

// api的权限控制是否分组织还需要考虑，目前未加组织id
const Sys_Role_Api_PermissionModel = conn.define('sys_role_api_permission', {
    id: { type: sequelize.INTEGER, autoIncrement: true, primaryKey: true, unique: true },

    roleId: { type: sequelize.INTEGER, allowNull: false, comment: '用户id' },
    roleName: { type: sequelize.STRING, allowNull: false, comment: '用户名称' },
    apiId: { type: sequelize.INTEGER, allowNull: false, comment: '' },
    apiName: { type: sequelize.STRING, allowNull: false, comment: 'api名称' },
    companyId: { type: sequelize.INTEGER, allowNull: false, comment: '公司id' },
}, {
        paranoid: true
    })

module.exports = Sys_Role_Api_PermissionModel
