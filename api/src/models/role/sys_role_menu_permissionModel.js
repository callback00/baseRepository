const sequelize = require('sequelize')
const moment = require('moment')
const dbConn = require('../../common/dbConn')
const conn = dbConn.getConn()

moment.locale('zh-cn')

const Sys_Role_Menu_PermissionModel = conn.define('sys_role_menu_permission', {
    id: { type: sequelize.INTEGER, autoIncrement: true, primaryKey: true, unique: true },

    roleId: { type: sequelize.INTEGER, allowNull: false, comment: '用户id' },
    roleName: { type: sequelize.STRING, allowNull: false, comment: '用户名称' },
    menuId: { type: sequelize.INTEGER, allowNull: false, comment: '导航路由id' },
    menuName: { type: sequelize.STRING, allowNull: false, comment: '导航路由名称' },
    menuType: { type: sequelize.ENUM, allowNull: false, values: ['1', '2'], defaultValue: '1', comment: '栏目类型: 1. 导航路由 2. 页面路由' },
    menuTypeDesc: { type: sequelize.STRING, allowNull: true, comment: '栏目类型描述' },
    companyId: { type: sequelize.INTEGER, allowNull: false, comment: '公司id' },
}, {
        paranoid: true
    })

module.exports = Sys_Role_Menu_PermissionModel
