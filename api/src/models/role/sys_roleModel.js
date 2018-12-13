const sequelize = require('sequelize')
const moment = require('moment')
const dbConn = require('../../common/dbConn')
const conn = dbConn.getConn()

moment.locale('zh-cn')

const Role = conn.define('sys_role', {
    id: { type: sequelize.INTEGER, autoIncrement: true, primaryKey: true, unique: true },

    name: { type: sequelize.STRING, allowNull: false, comment: '角色名称' },
    remark: { type: sequelize.STRING, defaultValue: null, comment: '角色描述' },
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

module.exports = Role
