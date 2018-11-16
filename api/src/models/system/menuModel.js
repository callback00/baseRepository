const sequelize = require('sequelize')
const moment = require('moment')
const dbConn = require('../../common/dbConn')
const conn = dbConn.getConn()

moment.locale('zh-cn')

// 栏目，与api权限不同，菜单栏可以分组织
const Menu = conn.define('sys_menu', {
    id: { type: sequelize.INTEGER, autoIncrement: true, primaryKey: true, unique: true },

    name: { type: sequelize.STRING, allowNull: false, comment: '栏目名称' },
    menuType: { type: sequelize.ENUM, allowNull: false, values: ['1', '2'], defaultValue: '1', comment: '栏目类型: 1. 导航栏目 2. 页面路由' },
    menuTypeDesc: { type: sequelize.STRING, allowNull: true, comment: '栏目类型描述' },
    menuLink: { type: sequelize.STRING, allowNull: true, comment: '路由链接' },
    icon: { type: sequelize.STRING, allowNull: true, comment: '图标' },
    parentId: { type: sequelize.INTEGER, allowNull: false, comment: '父节点id' },
    comPath: { type: sequelize.STRING, allowNull: true, comment: '组件相对dashboard的路径' },
    treeId: { type: sequelize.STRING, allowNull: false, comment: '上层节点id,以,隔开' },
    isLeaf: { type: sequelize.BOOLEAN, allowNull: false, comment: '是否叶节点' },
    sort: { type: sequelize.INTEGER, defaultValue: null, comment: '排序' },

    remark: { type: sequelize.STRING, defaultValue: null, comment: '备注' },
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

module.exports = Menu
