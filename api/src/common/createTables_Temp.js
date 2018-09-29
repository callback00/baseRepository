//该文件做作用仅仅是同步一些中间加入的表，防止误删createTables.js的内容引起生产环境的错误

const Api = require('../models/system/apiModel')
const Sys_Api_Permission = require('../models/system/sys_api_permission')


// ---------- 创建 api权限 表 ----------
Sys_Api_Permission.sync({ force: true }).then(() => {
    console.log(`----- 创建 Sys_Api_Permission 表成功 -----`)
}).catch((err) => {
    console.error(`----- Sys_Api_Permission 表创建失败: ${err} -----`)
})

// ---------- 创建 api管理列表 表 ----------
Api.sync({ force: true }).then(() => {
    console.log(`----- 创建 Api 表成功 -----`)
}).catch((err) => {
    console.error(`----- Api 表创建失败: ${err} -----`)
})