const sequelize = require('sequelize')
const { union } = require('lodash')
const logger = require('../../../common/logger')
const Sys_Menu_Permission = require('../../../models/system/sys_menu_permission')
const Menu = require('../../../models/system/menuModel')
const User = require('../../../models/userModel')

const dbConn = require('../../../common/dbConn')
const conn = dbConn.getConn()

// 由顶层向下递归赋值children
function buildTree(nodeList, menuList) {

    nodeList.forEach(node => {

        // 这一步与构建树无关，处理节点的treeId结构，用于处理antd的Menu默认展开路径
        if (node.treeId) {
            node.treeId = node.treeId.replace(/\[/g, '').replace(/\]/g, '').split(',');
        }

        const children = menuList.filter(function (item) {
            return item.parentId === node.id;
        });

        if (children.length > 0) {
            node.children = children;
            buildTree(children, menuList)
        }
    });

    return nodeList
}

module.exports = {
    getMenuPermissionTree: async (userId, callback) => {
        try {
            const menuList = await conn.query(
                `select  id, name, menuLink, icon, parentId, treeId, isLeaf, sort, remark from sys_menus where deletedAt is null order by sort asc,createdAt asc
            `, { type: sequelize.QueryTypes.SELECT }
            ).then((result) => {
                return result;
            })

            const permissionList = await conn.query(
                `select  id, userId, userName, menuId, menuName from sys_menu_permissions where userId = ${userId} and deletedAt is null 
            `, { type: sequelize.QueryTypes.SELECT }
            ).then((result) => {
                return result;
            })

            const result = buildTree([{ id: 0, name: '导航栏目' }], menuList).sort((a, b) => a.sort - b.sort);

            let rtnObject = { treeData: [], permissionList };
            if (result[0].children) {
                rtnObject = { treeData: result[0].children, permissionList };
            }

            return callback(null, rtnObject);
        } catch (error) {
            logger.error(`----- menuPermissionOperate getMenuTree error = ${error} -----`)
            callback('请求已被服务器拒绝')
        }
    },

    permissionSave: async (addKeyList, deleteKeyList, userId, callback) => {

        try {

            const menuList = await Menu.findAll({
                where: {
                    id: {
                        $in: addKeyList
                    },
                    isLeaf: true
                }
            }).then((result) => {
                return result;
            })

            const user = await User.findOne({
                where: {
                    userId
                }
            }).then((result) => {
                return result;
            })

            const addList = [];

            menuList.forEach(item => {
                const data = { userId: user.userId, userName: user.loginName, menuId: item.id, menuName: item.name, menuType: item.menuType, menuTypeDesc: item.menuTypeDesc }
                addList.push(data)
            })

            // 回调函数改成异步的了，所以不能在then后接catch来回顾，因为trans还没生成
            conn.transaction({
                autocommit: false
            }).then(async (trans) => {

                try {
                    // 批量创建返回的数据主键是为空的，只有调用create的方法返回的主键才会有值
                    const createResult = await Sys_Menu_Permission.bulkCreate(addList, {
                        transaction: trans
                    }).then((result) => {
                        return result;
                    });

                    // 不需要将字符数组转换为int，mysql查询时会自动转
                    const deleteResult = await Sys_Menu_Permission.destroy({
                        where: {
                            userId,
                            menuId: {
                                $in: deleteKeyList
                            }
                        },
                        transaction: trans,
                        force: true
                    }).then((result) => {
                        return result;
                    });

                    trans.commit();
                    callback(null, '修改成功')
                } catch (error) {
                    trans.rollback();
                    logger.error(`----- menuPermissionOperate permissionSave inner try catch error = ${error} -----`);
                    return callback('请求已被服务器拒绝');
                }
            })
        } catch (error) {
            logger.error(`----- menuPermissionOperate permissionSave try catch error = ${error} -----`);
            return callback('请求已被服务器拒绝');
        }
    },

    getCurrentMenuPermission: async (userId, callback) => {

        const permissionList = await conn.query(
            `select  A.id, A.userId, A.userName, A.menuId, A.menuName, B.treeId, B.menuLink, B.comPath from sys_menu_permissions A inner join sys_menus B on A.menuId = B.id  where A.userId = ${userId} and A.deletedAt is null
            `, { type: sequelize.QueryTypes.SELECT }
        ).then((result) => {
            return result;
        })

        let parentIdList = [];
        let leafMenuIdList = []
        permissionList.forEach((item) => {
            const treeId = item.treeId.replace(/\[/g, '').replace(/\]/g, '').split(',');
            parentIdList = union(parentIdList, treeId);

            leafMenuIdList.push(item.menuId);
        })

        const parentIds = parentIdList.join(',');
        const selectIds = union(parentIdList, leafMenuIdList).join(',');

        let menuList = []
        if (selectIds) {
            menuList = await conn.query(
                `select  id, name, menuLink, icon, parentId, treeId, isLeaf, menuType, sort, remark from sys_menus where deletedAt is null and id in (${selectIds}) order by sort asc,createdAt asc
                `, { type: sequelize.QueryTypes.SELECT }
            ).then((result) => {
                return result;
            })
        }

        const result = buildTree([{ id: 0, name: '导航栏目' }], menuList).sort((a, b) => a.sort - b.sort);
        const menuPermissionList = permissionList;

        if (result[0].children) {
            return callback(null, { menuTreeList: result[0].children, menuPermissionList })
        } else {
            return callback(null, { menuTreeList: [], menuPermissionList });
        }

    },
}
