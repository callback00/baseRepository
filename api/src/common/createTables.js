const User = require('../models/userModel')
const Sys_Menu = require('../models/system/menuModel')
const Sys_Menu_Permission = require('../models/system/sys_menu_permission')
const Api = require('../models/system/apiModel')
const Sys_Api_Permission = require('../models/system/sys_api_permission')
const Member = require('../models/memberModel')
const WorkArea = require('../models/workAreaModel')
const WorkAreaAuditer = require('../models/workAreaAuditerModel')

const Notice = require('../models/notice/noticeModel')
const NoticeDetail = require('../models/notice/noticeDetailModel')

// ---------- 创建 用户表 表 ----------
User.sync({ force: true }).then(() => {
  console.log(`----- 创建 User 表成功 -----`)
}).catch((err) => {
  console.error(`----- User 表创建失败: ${err} -----`)
})

// ---------- 创建 栏目权限 表 ----------
Sys_Menu_Permission.sync({ force: true }).then(() => {
  console.log(`----- 创建 Sys_Menu_Permission 表成功 -----`)
}).catch((err) => {
  console.error(`----- Sys_Menu_Permission 表创建失败: ${err} -----`)
})

// ---------- 创建 导航栏目 表 ----------
Sys_Menu.sync({ force: true }).then(() => {
  console.log(`----- 创建 Sys_Menu 表成功 -----`)
}).catch((err) => {
  console.error(`----- Sys_Menu 表创建失败: ${err} -----`)
})

// ---------- 创建 Member 表 ----------
Member.sync({ force: true }).then(() => {
  console.log(`----- 创建 Member 表成功 -----`)
}).catch((err) => {
  console.error(`----- Member 表创建失败: ${err} -----`)
})

// ---------- 创建 WorkArea 表 ----------
WorkArea.sync({ force: true }).then(() => {
  console.log(`----- 创建 WorkArea 表成功 -----`)
}).catch((err) => {
  console.error(`----- WorkArea 表创建失败: ${err} -----`)
})

// ---------- 创建 WorkAreaAuditer 表 ----------
WorkAreaAuditer.sync({ force: true }).then(() => {
  console.log(`----- 创建 WorkAreaAuditer 表成功 -----`)
}).catch((err) => {
  console.error(`----- WorkAreaAuditer 表创建失败: ${err} -----`)
})

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