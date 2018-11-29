const sequelize = require('sequelize')
const { union } = require('lodash')
const logger = require('../../../common/logger')
const Sys_Api_Permission = require('../../../models/system/sys_api_permission')
const Api = require('../../../models/system/apiModel')
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
    getApiPermissionTree: async (userId, callback) => {
        try {
            const apiList = await conn.query(
                `select  id, name, parentId, treeId, isLeaf, sort, remark from sys_apis where deletedAt is null order by sort asc,createdAt asc
            `, { type: sequelize.QueryTypes.SELECT }
            ).then((result) => {
                return result;
            })

            const permissionList = await conn.query(
                `select  id, userId, userName, apiId, apiName from sys_api_permissions where userId = ${userId} and deletedAt is null 
            `, { type: sequelize.QueryTypes.SELECT }
            ).then((result) => {
                return result;
            })

            const result = buildTree([{ id: 0, name: 'api管理' }], apiList).sort((a, b) => a.sort - b.sort);

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

    permissionSave: async (addKeyList, deleteKeyList, userId, callback) => {

        try {

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

            const user = await User.findOne({
                where: {
                    userId
                }
            }).then((result) => {
                return result;
            })

            const addList = [];

            apiList.forEach(item => {
                const data = { userId: user.userId, userName: user.loginName, apiId: item.id, apiName: item.name }
                addList.push(data)
            })

            // 回调函数改成异步的了，所以不能在then后接catch来回顾，因为trans还没生成
            conn.transaction({
                autocommit: false
            }).then(async (trans) => {

                try {
                    // 批量创建返回的数据主键是为空的，只有调用create的方法返回的主键才会有值
                    const createResult = await Sys_Api_Permission.bulkCreate(addList, {
                        transaction: trans
                    }).then((result) => {
                        return result;
                    });

                    // 不需要将字符数组转换为int，mysql查询时会自动转
                    const deleteResult = await Sys_Api_Permission.destroy({
                        where: {
                            userId,
                            apiId: {
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
                    logger.error(`----- apiPermissionOperate permissionSave inner try catch error = ${error} -----`);
                    return callback('请求已被服务器拒绝');
                }
            })
        } catch (error) {
            logger.error(`----- apiPermissionOperate permissionSave try catch error = ${error} -----`);
            return callback('请求已被服务器拒绝');
        }
    },

    getCurrentApiPermission: async (userId, callback) => {

        const permissionList = await conn.query(
            `select  A.id, A.userId, A.userName, A.apiId, A.apiName, B.treeId, B.url from sys_api_permissions A inner join sys_apis B on A.menuId = B.id  where A.userId = ${userId} and A.deletedAt is null
            `, { type: sequelize.QueryTypes.SELECT }
        ).then((result) => {
            return result;
        })

        let parentIdList = [];
        let leafApiIdList = []
        permissionList.forEach((item) => {
            const treeId = item.treeId.replace(/\[/g, '').replace(/\]/g, '').split(',');
            parentIdList = union(parentIdList, treeId);

            leafApiIdList.push(item.apiId);
        })

        const parentIds = parentIdList.join(',');
        const selectIds = union(parentIdList, leafApiIdList).join(',');

        let apiList = []
        if (selectIds) {
            apiList = await conn.query(
                `select  id, name, url, parentId, treeId, isLeaf, sort, remark from sys_apis where deletedAt is null and id in (${selectIds}) order by sort asc,createdAt asc
                `, { type: sequelize.QueryTypes.SELECT }
            ).then((result) => {
                return result;
            })
        }

        const result = buildTree([{ id: 0, name: 'api管理' }], apiList).sort((a, b) => a.sort - b.sort);
        const apiPermissionList = permissionList;

        if (result[0].children) {
            return callback(null, { apiTreeList: result[0].children, apiPermissionList })
        } else {
            return callback(null, { apiTreeList: [], apiPermissionList });
        }

    },
}
