//该文件做作用仅仅是同步一些中间加入的表，防止误删createTables.js的内容引起生产环境的错误

const Company = require('../../models/system/sys_companyModel')

// ---------- 创建 企业表 表 ----------
Company.sync({ force: true }).then(() => {
  console.log(`----- 创建 Company 表成功 -----`)
}).catch((err) => {
  console.error(`----- Company 表创建失败: ${err} -----`)
})