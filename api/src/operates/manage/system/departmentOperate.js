const sequelize = require('sequelize')
const logger = require('../../../common/logger')
const Department = require('../../../models/system/department/departmentModel')
const User = require('../../../models/system/userModel')

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
    getDepartmentTree: async (companyId, callback) => {

        try {
            const data = await conn.query(
                `select  id, name, parentId, sort, remark, name as title, id as value, id as 'key'  from sys_departments where deletedAt is null and companyId = '${companyId}' order by sort asc,createdAt asc
            `, { type: sequelize.QueryTypes.SELECT }
            ).then((result) => {
                return result;
            })

            const nodeList = data.filter((item) => {
                return item.parentId === 0;
            })

            const result = buildTree(nodeList, data).sort((a, b) => a.sort - b.sort);
            if (result) {
                return callback(null, result);
            } else {
                return callback(null, []);
            }
        } catch (error) {
            logger.error(`----- departmentOperate getDepartmentTree error = ${error} -----`);
            callback('请求已被服务器拒绝');
        }
    },

    getDepartmentById: async (id, callback) => {

        try {
            const department = await Department.findOne({
                where: { id },
            }).then((item) => {
                return item;
            });

            return callback(null, department);
        } catch (error) {
            logger.error(`----- departmentOperate getDepartmentById error = ${error} -----`);
            return callback('请求已被服务器拒绝');
        }
    },

    departmentCreate: async (name, parentId, sort, remark, companyId, callback) => {

        let data = {
            name,
            sort,
            remark,
            companyId
        };

        if (parentId === '0' || parentId === 0) {
            data.parentId = 0;
            data.treeId = '[0]';
            data.isLeaf = true;

            try {
                const result = await Department.create(data).then((result) => {
                    return result;
                })

                return callback(null, '创建成功。');
            } catch (error) {
                logger.error(`----- departmentOperate departmentCreate first try catch error = ${error} -----`);
                return callback('请求已被服务器拒绝');
            }
        } else {
            let parentNode = await Department.findOne({ where: { id: parentId } }).then((parentNode) => {
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
                const createResult = await Department.create(data, { transaction: trans }).then((result) => {
                    return result;
                })

                const updateResult = await Department.update(
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

                logger.error(`----- departmentOperate companyCreate second try catch error = ${error} -----`);
                return callback('请求已被服务器拒绝');
            }
        }
    },

    departmentEdit: async (id, name, sort, remark, callback) => {
        try {
            const result = await Department.update(
                {
                    name,
                    sort,
                    remark
                },
                {
                    where: { id },
                }
            ).then((result) => {
                return result;
            })

            return callback(null, '更新成功');
        } catch (error) {
            logger.error(`----- departmentOperate departmentEdit error = ${error} -----`);
            return callback('请求已被服务器拒绝');
        }
    },

    departmentDelete: async (id, callback) => {

        const deleteItem = await Department.findOne({
            where: {
                id
            }
        });

        const parentId = deleteItem.parentId;

        const trans = await conn.transaction({
            autocommit: false
        }).then((trans) => {
            return trans;
        })

        try {
            await Department.destroy({
                where: {
                    id
                },
                transaction: trans,
                force: true // 真删除标记,此处用软删除
            })

            // 必须包含在事务中，如果不包含在事务中可以查询到删除的数据，因为事务没提交，还没真正提交，包含在事务内则查询不到
            const children = await Department.findAll({
                where: { parentId },
                transaction: trans,
            }).then((result) => {
                return result;
            })

            if (children.length < 1) {
                await Department.update(
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

            logger.error(`----- departmentOperate departmentDelete try catch error = ${error} -----`);
            return callback('请求已被服务器拒绝');
        }
    }
}
