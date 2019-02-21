//该文件做作用仅仅是同步一些中间加入的表，防止误删createTables.js的内容引起生产环境的错误

const noticeDetailModel = require('../../models/notice/noticeDetailModel')

// ---------- 创建 企业表 表 ----------
noticeDetailModel.sync({ force: true }).then(() => {
  console.log(`----- 创建 noticeDetailModel 表成功 -----`)
}).catch((err) => {
  console.error(`----- noticeDetailModel 表创建失败: ${err} -----`)
})