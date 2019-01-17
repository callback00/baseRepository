const sequelize = require('sequelize')
const logger = require('../../../common/logger')
const User = require('../../../models/userModel')
const Role = require('../../../models/role/sys_roleModel')
const Sys_Role_User = require('../../../models/role/sys_role_userModel')
const Sys_Role_Menu_Permission = require('../../../models/role/sys_role_menu_permissionModel')
const Sys_Role_Api_Permission = require('../../../models/role/sys_role_api_permissionModel')
const Menu = require('../../../models/system/menuModel')
const Api = require('../../../models/system/apiModel')

const dbConn = require('../../../common/dbConn')
const conn = dbConn.getConn()

function buildMenuTree(nodeList, menuList) {

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
            buildMenuTree(children, menuList)
        }
    });

    return nodeList
}

function buildApiTree(nodeList, apiList) {

    nodeList.forEach(node => {

        // 这一步与构建树无关，处理节点的treeId结构，用于处理antd的Menu默认展开路径
        if (node.treeId) {
            node.treeId = node.treeId.replace(/\[/g, '').replace(/\]/g, '').split(',');
        }

        const children = apiList.filter(function (item) {
            return item.parentId === node.id;
        });

        if (children.length > 0) {
            node.children = children;
            buildApiTree(children, apiList)
        }
    });

    return nodeList
}

module.exports = {
    getRoleList: async (companyId, callback) => {

        try {
            const data = await Role.findAll({ where: { companyId } })
            return callback(null, data);

        } catch (error) {
            logger.error(`----- roleOperate getRoleList error = ${error} -----`);
            callback('请求已被服务器拒绝');
        }
    },

    getRoleById: async (id, callback) => {

        try {
            const role = await Role.findOne({
                where: { id },
            }).then((item) => {
                return item;
            });

            return callback(null, role);
        } catch (error) {
            logger.error(`----- roleOperate getRoleById error = ${error} -----`);
            return callback('请求已被服务器拒绝');
        }
    },

    roleCreate: async (name, remark, companyId, callback) => {

        let data = {
            name,
            remark,
            companyId
        };

        try {
            const result = await Role.create(data).then((result) => {
                return result;
            })

            return callback(null, '创建成功。');
        } catch (error) {
            logger.error(`----- roleOperate roleCreate try catch error = ${error} -----`);
            return callback('请求已被服务器拒绝');
        }
    },

    roleEdit: async (id, name, remark, callback) => {
        try {
            const result = await Role.update(
                {
                    name,
                    remark,
                },
                {
                    where: { id },
                }
            ).then((result) => {
                return result;
            })

            await Sys_Role_User.update(
                {
                    roleName: name,
                },
                {
                    where: { roleId: id },
                }
            )

            await Sys_Role_Menu_Permission.update(
                {
                    roleName: name,
                },
                {
                    where: { roleId: id },
                }
            )

            await Sys_Role_Api_Permission.update(
                {
                    roleName: name,
                },
                {
                    where: { roleId: id },
                }
            )

            return callback(null, '更新成功');
        } catch (error) {
            logger.error(`----- roleOperate roleEdit error = ${error} -----`);
            return callback('请求已被服务器拒绝');
        }
    },

    roleDelete: async (id, callback) => {

        const trans = await conn.transaction({
            autocommit: false
        }).then((trans) => {
            return trans;
        })

        try {
            await Role.destroy({
                where: {
                    id
                },
                transaction: trans,
                force: true // 真删除标记
            })

            await Sys_Role_User.destroy({
                where: {
                    roleId: id
                },
                transaction: trans,
                force: true // 真删除标记
            })

            await Sys_Role_Menu_Permission.destroy({
                where: {
                    roleId: id
                },
                transaction: trans,
                force: true // 真删除标记
            })

            await Sys_Role_Api_Permission.destroy({
                where: {
                    roleId: id
                },
                transaction: trans,
                force: true // 真删除标记
            })

            trans.commit();
            return callback(null, '删除成功！');

        } catch (error) {
            trans.rollback();

            logger.error(`----- roleOperate roleDelete try catch error = ${error} -----`);
            return callback('请求已被服务器拒绝');
        }
    },

    getRoleUserByRoleId: async (roleId, companyId, callback) => {

        const roleUserList = await Sys_Role_User.findAll({
            where: { roleId },
            attributes: ['userId']
        })

        const allUserList = await User.findAll({
            where: {
                loginName: { 'ne': 'admin' },
                companyId
            },
            attributes: ['userId', 'loginName', ['displayName', 'userName']]
        })

        const roleUserIdList = [];
        roleUserList.forEach(element => {
            roleUserIdList.push(element.userId)
        });

        const result = {
            roleUserIdList,
            allUserList
        }

        return callback(null, result)
    },

    roleUserEdit: async (roleId, userIdList, companyId, callback) => {
        const role = await Role.findOne({
            where: { id: roleId },
        }).then((item) => {
            return item;
        });

        const deleteList = await Sys_Role_User.findAll({
            where: {
                roleId,
                userid: userIdList.length > 0 ? { 'notIn': userIdList } : { 'ne': null }
            }
        })

        const deleteIdArry = [];
        deleteList.forEach(element => {
            deleteIdArry.push(element.userId)
        });

        const userList = await User.findAll({
            where: {
                userId: { 'in': userIdList },
                companyId
            }
        })

        const roleUserList = await Sys_Role_User.findAll({
            where: {
                roleId,
            }
        })

        if (role) {
            const list = [];
            userList.forEach(item => {
                let addFlag = true

                for (let i = 0; i < roleUserList.length; i++) {
                    if (roleUserList[i].userId === item.userId) {
                        addFlag = false
                        break
                    }
                }

                if (addFlag) {
                    const data = {
                        roleId,
                        roleName: role.name,
                        userId: item.userId,
                        loginName: item.loginName,
                        userName: item.displayName
                    }

                    list.push(data)
                }
            });

            await Sys_Role_User.bulkCreate(list);
            await Sys_Role_User.destroy({
                where: {
                    userId: { 'in': deleteIdArry },
                }
            })

            return callback(null, '编辑成功')
        } else {
            return callback('编辑失败，角色不存在');
        }
    },

    getRoleMenuPermissionTree: async (roleId, callback) => {
        try {
            const menuList = await conn.query(
                `select  id, name, menuLink, icon, parentId, treeId, isLeaf, sort, remark from sys_menus where deletedAt is null order by sort asc,createdAt asc
            `, { type: sequelize.QueryTypes.SELECT }
            ).then((result) => {
                return result;
            })

            const permissionList = await conn.query(
                `select  id, roleId, roleName, menuId, menuName from sys_role_menu_permissions where roleId = ${roleId} and deletedAt is null 
            `, { type: sequelize.QueryTypes.SELECT }
            ).then((result) => {
                return result;
            })

            const result = buildMenuTree([{ id: 0, name: '导航路由' }], menuList).sort((a, b) => a.sort - b.sort);

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

    roleMenuPermissionEdit: async (addKeyList, deleteKeyList, roleId, companyId, callback) => {

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

        const role = await Role.findOne({
            where: {
                id: roleId
            }
        }).then((result) => {
            return result;
        })

        const addList = [];

        menuList.forEach(item => {
            const data = { roleId: role.id, roleName: role.name, menuId: item.id, menuName: item.name, menuType: item.menuType, menuTypeDesc: item.menuTypeDesc, companyId }
            addList.push(data)
        })

        // 回调函数改成异步的了，所以不能在then后接catch来回顾，因为trans还没生成
        conn.transaction({
            autocommit: false
        }).then(async (trans) => {

            try {
                // 批量创建返回的数据主键是为空的，只有调用create的方法返回的主键才会有值
                await Sys_Role_Menu_Permission.bulkCreate(addList, {
                    transaction: trans
                })

                // 不需要将字符数组转换为int，mysql查询时会自动转
                await Sys_Role_Menu_Permission.destroy({
                    where: {
                        roleId,
                        menuId: {
                            $in: deleteKeyList
                        }
                    },
                    transaction: trans,
                    force: true
                })

                trans.commit();
                callback(null, '修改成功')
            } catch (error) {
                trans.rollback();
                logger.error(`----- roleOperate roleMenuPermissionEdit inner try catch error = ${error} -----`);
                return callback('请求已被服务器拒绝');
            }
        })

    },

    getRoleApiPermissionTree: async (roleId, callback) => {
        try {
            const apiList = await conn.query(
                `select  id, name, parentId, treeId, isLeaf, sort, remark from sys_apis where deletedAt is null order by sort asc,createdAt asc
            `, { type: sequelize.QueryTypes.SELECT }
            ).then((result) => {
                return result;
            })

            const permissionList = await conn.query(
                `select  id, roleId, roleName, apiId, apiName from sys_role_api_permissions where roleId = ${roleId} and deletedAt is null 
            `, { type: sequelize.QueryTypes.SELECT }
            ).then((result) => {
                return result;
            })

            const result = buildApiTree([{ id: 0, name: 'api管理' }], apiList).sort((a, b) => a.sort - b.sort);

            let rtnObject = { treeData: [], permissionList };
            if (result[0].children) {
                rtnObject = { treeData: result[0].children, permissionList };
            }

            return callback(null, rtnObject);
        } catch (error) {
            logger.error(`----- apiPermissionOperate getApiPermissionTree error = ${error} -----`)
            callback('请求已被服务器拒绝')
        }
    },

    roleApiPermissionEdit: async (addKeyList, deleteKeyList, roleId, companyId, callback) => {

        const apiList = await Api.findAll({
            where: {
                id: {
                    $in: addKeyList
                },
                isLeaf: true
            }
        }).then((result) => {
            return result;
        })

        const role = await Role.findOne({
            where: {
                id: roleId
            }
        }).then((result) => {
            return result;
        })

        const addList = [];

        apiList.forEach(item => {
            const data = { roleId: role.id, roleName: role.name, apiId: item.id, apiName: item.name, companyId }
            addList.push(data)
        })

        // 回调函数改成异步的了，所以不能在then后接catch来回顾，因为trans还没生成
        conn.transaction({
            autocommit: false
        }).then(async (trans) => {

            try {
                await Sys_Role_Api_Permission.bulkCreate(addList, {
                    transaction: trans
                })

                await Sys_Role_Api_Permission.destroy({
                    where: {
                        roleId,
                        apiId: {
                            $in: deleteKeyList
                        }
                    },
                    transaction: trans,
                    force: true
                })

                trans.commit();
                callback(null, '修改成功')
            } catch (error) {
                trans.rollback();
                logger.error(`----- roleOperate roleApiPermissionEdit inner try catch error = ${error} -----`);
                return callback('请求已被服务器拒绝');
            }
        })
    },
}
