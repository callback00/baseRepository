const User = require('../models/userModel')
const Rule = require('../models/ruleModel')
const RuleMap = require('../models/rulemapModel')
const Menu = require('../models/system/menuModel')
const Sys_Menu_Permission = require('../models/system/sys_menu_permission')
const Member = require('../models/memberModel')
const WorkArea = require('../models/workAreaModel')
const WorkAreaAuditer = require('../models/workAreaAuditerModel')
const AuditLog = require('../models/auditLogModel')

// ---------- 创建 用户表 表 ----------
User.sync({ force: true }).then(() => {
  console.log(`----- 创建 User 表成功 -----`)
}).catch((err) => {
  console.error(`----- User 表创建失败: ${err} -----`)
})

// ---------- 创建 Rule 表 ----------
Rule.sync({ force: true }).then(() => {
  console.log(`----- 创建 Rule 表成功 -----`)
}).catch((err) => {
  console.error(`----- Rule 表创建失败: ${err} -----`)
})

// ---------- 创建 RuleMap 表 ----------
RuleMap.sync({ force: true }).then(() => {
  console.log(`----- 创建 RuleMap 表成功 -----`)
}).catch((err) => {
  console.error(`----- RuleMap 表创建失败: ${err} -----`)
})

// ---------- 创建 栏目权限 表 ----------
Sys_Menu_Permission.sync({ force: true }).then(() => {
  console.log(`----- 创建 Sys_Menu_Permission 表成功 -----`)
}).catch((err) => {
  console.error(`----- Sys_Menu_Permission 表创建失败: ${err} -----`)
})

// ---------- 创建 导航栏目 表 ----------
Menu.sync({ force: true }).then(() => {
  console.log(`----- 创建 Menu 表成功 -----`)
}).catch((err) => {
  console.error(`----- Menu 表创建失败: ${err} -----`)
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

// ---------- 创建 核销记录表 表 ----------
AuditLog.sync({ force: true }).then(() => {
  console.log(`----- 创建 AuditLog 表成功 -----`)
}).catch((err) => {
  console.error(`----- AuditLog 表创建失败: ${err} -----`)
})
