const sequelize = require('sequelize')
const moment = require('moment')
const dbConn = require('../../common/dbConn')
const conn = dbConn.getConn()

moment.locale('zh-cn')

// 多组织
const Company = conn.define('sys_company', {
    id: { type: sequelize.INTEGER, autoIncrement: true, primaryKey: true, unique: true },

    name: { type: sequelize.STRING, allowNull: false, comment: '组织名称' },
    parentId: { type: sequelize.INTEGER, allowNull: false, comment: '父节点id' },
    treeId: { type: sequelize.STRING, allowNull: false, comment: '上层节点id,以,隔开' },
    isLeaf: { type: sequelize.BOOLEAN, allowNull: false, comment: '是否叶节点' },
    sort: { type: sequelize.INTEGER, defaultValue: null, comment: '排序' },
    remark: { type: sequelize.STRING, defaultValue: null, comment: '备注' },
    createdAt: {
        type: sequelize.DATE,
        get() {
            return moment(this.getDataValue('createdAt')).format('YYYY-MM-DD HH:mm:ss');
        }
    }
}, {
        paranoid: true
    })

module.exports = Company
