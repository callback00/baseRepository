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

        for (let i = 0; i < companyData.length; i++) {
            // 创建默认用户
            const adminUser = await User.create({ loginName: 'admin', displayName: '超级管理员', password: 'fb71dec4e0f6ca87c720ff11ed8faa59c824f48f', gender: '1', status: '1', companyId: i + 1 }, { transaction: trans }).then((users) => {
                return users;
            })

            // 先创建一级菜单, 使用批量创建无法返回id。
            const userMenu = await Sys_Menu.create({ name: '用户管理', menuType: '1', menuTypeDesc: '导航栏目', icon: 'usergroup-add', parentId: 0, treeId: '[0]', isLeaf: '0', sort: 1, companyId: i + 1 }, { transaction: trans });
            const systemMenu = await Sys_Menu.create({ name: '系统配置', menuType: '1', menuTypeDesc: '导航栏目', icon: 'setting', parentId: 0, treeId: '[0]', isLeaf: '0', sort: 2, companyId: i + 1 }, { transaction: trans })
            const noticeMenu = await Sys_Menu.create({ name: '消息管理', menuType: '1', menuTypeDesc: '导航栏目', menuLink: '/notice/home', icon: 'message', comPath: '/system/notice/noticeHome.js', parentId: 0, treeId: `[0]`, isLeaf: '1', sort: 3, companyId: i + 1 }, { transaction: trans });

            // 创建二级菜单
            const menu1 = await Sys_Menu.create({ name: '用户列表', menuType: '1', menuTypeDesc: '导航栏目', menuLink: '/user/list', comPath: '/user/userList.js', parentId: userMenu.id, treeId: `[0],[${userMenu.id}]`, isLeaf: '1', sort: 1, companyId: i + 1 }, { transaction: trans });
            const menu2 = await Sys_Menu.create({ name: '添加用户', menuType: '1', menuTypeDesc: '导航栏目', menuLink: '/user/add', comPath: '/user/userAdd.js', parentId: userMenu.id, treeId: `[0],[${userMenu.id}]`, isLeaf: '1', sort: 2, companyId: i + 1 }, { transaction: trans });
            const menu3 = await Sys_Menu.create({ name: '用户信息', menuType: '2', menuTypeDesc: '页面路由', menuLink: '/user/info/:id', comPath: '/user/userInfo.js', parentId: userMenu.id, treeId: `[0],[${userMenu.id}]`, isLeaf: '1', sort: 3, companyId: i + 1 }, { transaction: trans });
            const menu4 = await Sys_Menu.create({ name: '菜单管理', menuType: '1', menuTypeDesc: '导航栏目', menuLink: '/systemSetting/menu/menuHome', comPath: '/system/menu/menuHome.js', parentId: systemMenu.id, treeId: `[0],[${systemMenu.id}]`, isLeaf: '1', sort: 1, companyId: i + 1 }, { transaction: trans });
            const menu5 = await Sys_Menu.create({ name: 'api管理', menuType: '1', menuTypeDesc: '导航栏目', menuLink: '/systemSetting/apiManage/apiManageHome', comPath: '/system/apiManage/apiManageHome.js', parentId: systemMenu.id, treeId: `[0],[${systemMenu.id}]`, isLeaf: '1', sort: 2, companyId: i + 1 }, { transaction: trans });

            console.log('测试', adminUser)
            const menuPermissionData = [
                { userId: adminUser.userId, userName: 'admin', menuId: menu1.id, menuName: menu1.name, menuType: '1', menuTypeDesc: '导航栏目', companyId: i + 1 },
                { userId: adminUser.userId, userName: 'admin', menuId: menu2.id, menuName: menu2.name, menuType: '1', menuTypeDesc: '导航栏目', companyId: i + 1 },
                { userId: adminUser.userId, userName: 'admin', menuId: menu3.id, menuName: menu3.name, menuType: '2', menuTypeDesc: '页面路由', companyId: i + 1 },
                { userId: adminUser.userId, userName: 'admin', menuId: menu4.id, menuName: menu4.name, menuType: '1', menuTypeDesc: '导航栏目', companyId: i + 1 },
                { userId: adminUser.userId, userName: 'admin', menuId: menu5.id, menuName: menu5.name, menuType: '1', menuTypeDesc: '导航栏目', companyId: i + 1 },
                { userId: adminUser.userId, userName: 'admin', menuId: noticeMenu.id, menuName: noticeMenu.name, menuType: '1', menuTypeDesc: '导航栏目', companyId: i + 1 }
            ]
            // 创建菜单权限
            await Sys_Menu_Permission.bulkCreate(menuPermissionData, { transaction: trans });
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

        const apiPermissionData = []
        const tempUsers = await User.findAll();
        tempUsers.forEach(user => {
            apiPermissionData.push(
                { userId: user.userId, userName: 'admin', apiId: api1.id, apiName: api1.name },
                { userId: user.userId, userName: 'admin', apiId: api2.id, apiName: api2.name }
            )
        });
        await Sys_Api_Permission.bulkCreate(apiPermissionData, { transaction: trans })

        trans.commit();

    } catch (error) {
        trans.rollback();
        console.log(`----- InitSystemData catch error = ${error} -----`);
    }
};

initData();
