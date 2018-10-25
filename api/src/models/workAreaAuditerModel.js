const sequelize = require('sequelize')
const moment = require('moment')
const dbConn = require('../common/dbConn')
const conn = dbConn.getConn()

moment.locale('zh-cn')

// 会员-分组-关系表
const WorkAreaAuditer = conn.define('workareaauditer', {
    id: { type: sequelize.INTEGER, autoIncrement: true, primaryKey: true, unique: true },

    auditPhone: { type: sequelize.STRING, allowNull: false, comment: '管理员手机号码' },
    auditName: { type: sequelize.STRING, allowNull: false, comment: '管理员姓名' },
    waid: { type: sequelize.INTEGER, allowNull: false, comment: '区域id' },
    workAreaName: { type: sequelize.STRING, allowNull: false, comment: '区域名称' },
    treeid: { type: sequelize.STRING, defaultValue: null, comment: '上层id,以,隔开' },

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

module.exports = WorkAreaAuditer
