const sequelize = require('sequelize')
const logger = require('../../../common/logger')
const Api = require('../../../models/system/apiModel')
const Sys_Api_Permission = require('../../../models/system/sys_api_permission')

const dbConn = require('../../../common/dbConn')
const conn = dbConn.getConn()

// 由顶层向下递归赋值children
function buildTree(nodeList, data) {

    nodeList.forEach(node => {

        const children = data.filter(function (item) {
            return item.parentId === node.id;
        });

        if (children.length > 0) {
            node.children = children;
            buildTree(children, data);
        }
    });

    return nodeList;
}

module.exports = {
    getApiTree: async (callback) => {

        try {
            const data = await conn.query(
                `select  id, name, url, parentId, treeId, isLeaf, sort, remark from sys_apis where deletedAt is null order by sort asc,createdAt asc
            `, { type: sequelize.QueryTypes.SELECT }
            ).then((result) => {
                return result;
            })

            const result = buildTree([{ id: 0, name: '后台api管理' }], data).sort((a, b) => a.sort - b.sort);

            if (result[0].children) {
                return callback(null, result[0].children);
            } else {
                return callback(null, []);
            }
        } catch (error) {
            logger.error(`----- apiOperate getApiTree error = ${error} -----`);
            callback('请求已被服务器拒绝');
        }
    },

    getApiById: async (id, callback) => {

        try {
            const api = await Api.findOne({
                where: { id },
            }).then((item) => {
                return item;
            });

            return callback(null, api);
        } catch (error) {
            logger.error(`----- apiOperate getApiById error = ${error} -----`);
            return callback('请求已被服务器拒绝');
        }
    },

    apiCreate: async (name, url, parentId, sort, callback) => {

        let data = {
            name,
            url,
            sort
        };

        if (parentId === '0' || parentId === 0) {
            data.parentId = 0;
            data.treeId = '[0]';
            data.isLeaf = true;

            try {
                const result = await Api.create(data).then((result) => {
                    return result;
                })

                return callback(null, '创建成功。');
            } catch (error) {
                logger.error(`----- apiOperate apiCreate first try catch error = ${error} -----`);
                return callback('请求已被服务器拒绝');
            }
        } else {
            let parentNode = await Api.findOne({ where: { id: parentId } }).then((parentNode) => {
                return parentNode;
            });

            if (!parentNode) {
                parentNode = { id: 0, treeId: '' };
            }

            data.parentId = parentNode.id;
            data.treeId = parentNode.treeId ? `${parentNode.treeId},[${parentNode.id}]` : `[${parentNode.id}]`; // 如果存1,2,3,4,11,13，则查询会出问题,如果存[1],[2],[3],[4],[11],[13]查询时加上[]则没有问题
            data.isLeaf = true;

            parentNode.isLeaf = false;

            const trans = await conn.transaction({
                autocommit: false
            }).then((trans) => {
                return trans;
            })

            try {
                const createResult = await Api.create(data, { transaction: trans }).then((result) => {
                    return result;
                })

                const updateResult = await Api.update(
                    {
                        isLeaf: false
                    },
                    {
                        where: { id: parentNode.id },
                        transaction: trans
                    }
                ).then((result) => {
                    return result;
                })

                trans.commit();
                return callback(null, '创建成功。');

            } catch (error) {
                trans.rollback();

                logger.error(`----- apiOperate apiCreate second try catch error = ${error} -----`);
                return callback('请求已被服务器拒绝');
            }
        }
    },

    apiEdit: async (id, name, url, sort, callback) => {
        try {
            const result = await Api.update(
                {
                    name,
                    url,
                    sort,
                },
                {
                    where: { id },
                }
            ).then((result) => {
                return result;
            })

            await Sys_Api_Permission.update(
                {
                    apiName: name,
                },
                {
                    where: { apiId: id },
                }
            )

            return callback(null, '更新成功');
        } catch (error) {
            logger.error(`----- apiOperate apiEdit error = ${error} -----`);
            return callback('请求已被服务器拒绝');
        }
    },

    apiDelete: async (id, callback) => {

        const deleteApi = await Api.findOne({
            where: {
                id
            }
        });

        const parentId = deleteApi.parentId;

        const trans = await conn.transaction({
            autocommit: false
        }).then((trans) => {
            return trans;
        })

        try {
            await Api.destroy({
                where: {
                    id
                },
                transaction: trans,
                force: true // 真删除标记
            })

            await Sys_Api_Permission.destroy({
                where: {
                    apiId: id
                },
                transaction: trans,
                force: true // 真删除标记
            })

            // 必须包含在事务中，如果不包含在事务中可以查询到删除的菜单，因为事务没提交，还没真正提交，包含在事务内则查询不到
            const children = await Api.findAll({
                where: { parentId },
                transaction: trans,
            }).then((result) => {
                return result;
            })

            if (children.length < 1) {
                await Api.update(
                    { isLeaf: true },
                    {
                        where: {
                            id: parentId
                        },
                        transaction: trans,
                    }
                );
            }

            trans.commit();
            return callback(null, '删除成功！');

        } catch (error) {
            trans.rollback();

            logger.error(`----- apiOperate apiDelete try catch error = ${error} -----`);
            return callback('请求已被服务器拒绝');
        }
    },
}
