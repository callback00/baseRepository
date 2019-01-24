// 本文件的作用是初始化系统基础数据，如创建管理员，创建初始菜单，创建初始权限
const sequelize = require('sequelize')
const dbConn = require('../../common/dbConn')
const conn = dbConn.getConn()

const Company = require('../../models/system/sys_companyModel')
const User = require('../../models/userModel')
const Sys_Menu = require('../../models/system/menuModel')
const Sys_Menu_Permission = require('../../models/system/sys_menu_permission')
const Api = require('../../models/system/apiModel')
const Sys_Api_Permission = require('../../models/system/sys_api_permission')


async function initData() {
    const trans = await conn.transaction({
        autocommit: false
    }).then((trans) => {
        return trans;
    })

    try {

        // 创建默认组织
        const companyData = [
            { name: '群邦市场投资有限公司', parentId: 0, treeId: '[0]', isLeaf: '0', sort: '1', remark: '集团总公司' },
            { name: '乐亿家信息科技有限公司', parentId: 1, treeId: '[0],[1]', isLeaf: '1', sort: '1', remark: '子公司' }
        ]
        Company.bulkCreate(companyData, { transaction: trans })

        // 先创建一级菜单, 使用批量创建无法返回id。
        const userMenu = await Sys_Menu.create({ name: '用户管理', menuType: '1', menuTypeDesc: '导航路由', icon: 'usergroup-add', parentId: 0, treeId: '[0]', isLeaf: '0', sort: 1 }, { transaction: trans });
        const roleMenu = await Sys_Menu.create({ name: '角色管理', menuType: '1', menuTypeDesc: '导航路由', menuLink: '/role/home', icon: 'contacts', comPath: '/role/roleHome.js', parentId: 0, treeId: '[0]', isLeaf: '1', sort: 2 }, { transaction: trans });
        const systemMenu = await Sys_Menu.create({ name: '系统配置', menuType: '3', menuTypeDesc: '导航路由', icon: 'setting', parentId: 0, treeId: '[0]', isLeaf: '0', sort: 3 }, { transaction: trans })
        const companyMenu = await Sys_Menu.create({ name: '企业管理', menuType: '1', menuTypeDesc: '导航路由', menuLink: '/company/home', icon: 'home', comPath: '/system/company/companyHome.js', parentId: 0, treeId: `[0]`, isLeaf: '1', sort: 4 }, { transaction: trans });
        const noticeMenu = await Sys_Menu.create({ name: '消息管理', menuType: '1', menuTypeDesc: '导航路由', menuLink: '/notice/home', icon: 'message', comPath: '/system/notice/noticeHome.js', parentId: 0, treeId: `[0]`, isLeaf: '1', sort: 5 }, { transaction: trans });

        // 创建二级菜单
        const menu1 = await Sys_Menu.create({ name: '用户列表', menuType: '1', menuTypeDesc: '导航路由', menuLink: '/user/list', comPath: '/user/userList.js', parentId: userMenu.id, treeId: `[0],[${userMenu.id}]`, isLeaf: '1', sort: 1 }, { transaction: trans });
        const menu2 = await Sys_Menu.create({ name: '添加用户', menuType: '1', menuTypeDesc: '导航路由', menuLink: '/user/add', comPath: '/user/userAdd.js', parentId: userMenu.id, treeId: `[0],[${userMenu.id}]`, isLeaf: '1', sort: 2 }, { transaction: trans });
        const menu3 = await Sys_Menu.create({ name: '用户信息', menuType: '2', menuTypeDesc: '页面路由', menuLink: '/user/info/:id', comPath: '/user/userInfo.js', parentId: userMenu.id, treeId: `[0],[${userMenu.id}]`, isLeaf: '1', sort: 3 }, { transaction: trans });
        const menu4 = await Sys_Menu.create({ name: '菜单管理', menuType: '3', menuTypeDesc: '导航路由', menuLink: '/systemSetting/menu/menuHome', comPath: '/system/menu/menuHome.js', parentId: systemMenu.id, treeId: `[0],[${systemMenu.id}]`, isLeaf: '1', sort: 1 }, { transaction: trans });
        const menu5 = await Sys_Menu.create({ name: 'api管理', menuType: '3', menuTypeDesc: '导航路由', menuLink: '/systemSetting/apiManage/apiManageHome', comPath: '/system/apiManage/apiManageHome.js', parentId: systemMenu.id, treeId: `[0],[${systemMenu.id}]`, isLeaf: '1', sort: 2 }, { transaction: trans });

        // 创建超级管理员以及超管权限
        for (let i = 0; i < companyData.length; i++) {
            // 创建默认用户
            const adminUser = await User.create({ loginName: 'admin', displayName: '超级管理员', password: 'fb71dec4e0f6ca87c720ff11ed8faa59c824f48f', gender: '1', status: '1', companyId: i + 1 }, { transaction: trans }).then((users) => {
                return users;
            })
        }

        // 先创建一级api
        const firstApis = await Api.create({ name: '系统配置', url: '', parentId: 0, treeId: '[0]', isLeaf: 0, sort: 1 }, { transaction: trans }).then((apis) => {
            return apis;
        })

        // 先创建二级api
        const secondApis = await Api.create({ name: 'api管理', url: '', parentId: firstApis.id, treeId: `[0],[${firstApis.id}]`, isLeaf: 0, sort: 1 }, { transaction: trans }).then((apis) => {
            return apis;
        })

        // 先创建三级级api
        const api1 = await Api.create({ name: '新增权限', url: '/apiManage/apiCreate', parentId: secondApis.id, treeId: `[0],[${firstApis.id},[secondApis.id]]`, isLeaf: 1, sort: 1 }, { transaction: trans }).then((api) => {
            return api;
        })
        const api2 = await Api.create({ name: '列表权限', url: '/apiManage/getApiTree', parentId: secondApis.id, treeId: `[0],[${firstApis.id}],[secondApis.id]`, isLeaf: 1, sort: 2 }, { transaction: trans }).then((api) => {
            return api;
        })

        trans.commit();

    } catch (error) {
        trans.rollback();
        console.log(`----- InitSystemData catch error = ${error} -----`);
    }
};

initData();
