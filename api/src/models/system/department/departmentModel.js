const sequelize = require('sequelize')
const moment = require('moment')
const dbConn = require('../../../common/dbConn')
const conn = dbConn.getConn()

moment.locale('zh-cn')

// 部门
const Department = conn.define('sys_department', {
    id: { type: sequelize.INTEGER, autoIncrement: true, primaryKey: true, unique: true },

    name: { type: sequelize.STRING, allowNull: false, comment: '部门名称' },
    parentId: { type: sequelize.INTEGER, allowNull: false, comment: '父节点id' },
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

module.exports = Department
