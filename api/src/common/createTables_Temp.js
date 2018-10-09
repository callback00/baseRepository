//该文件做作用仅仅是同步一些中间加入的表，防止误删createTables.js的内容引起生产环境的错误

const Notice = require('../models/notice/noticeModel')
const NoticeDetail = require('../models/notice/noticeDetailModel')


// ---------- 创建 消息模板表头 表 ----------
Notice.sync({ force: true }).then(() => {
    console.log(`----- 创建 Notice 表成功 -----`)
  }).catch((err) => {
    console.error(`----- Notice 表创建失败: ${err} -----`)
  })
  
  // ---------- 创建 消息明细 表 ----------
  NoticeDetail.sync({ force: true }).then(() => {
    console.log(`----- 创建 NoticeDetail 表成功 -----`)
  }).catch((err) => {
    console.error(`----- NoticeDetail 表创建失败: ${err} -----`)
  })