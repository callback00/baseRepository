const sequelize = require('sequelize')
const logger = require('../../../common/logger')
const Company = require('../../../models/system/sys_companyModel')
const Sys_Menu_Permission = require('../../../models/system/sys_menu_permission')
const User = require('../../../models/userModel')

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
    getCompanyTree: async (companyId, callback) => {

        try {
            const data = await conn.query(
                `select  id, name, parentId, sort, remark, name as title, id as value, id as 'key'  from sys_companies where deletedAt is null and (treeId like '%[${companyId}]%' or id = '${companyId}') order by sort asc,createdAt asc
            `, { type: sequelize.QueryTypes.SELECT }
            ).then((result) => {
                return result;
            })

            //取最上级公司节点
            const node = data.filter((item) => {
                return item.id === companyId;
            })[0]

            const result = buildTree([node], data).sort((a, b) => a.sort - b.sort);
            if (result) {
                return callback(null, result);
            } else {
                return callback(null, []);
            }
        } catch (error) {
            logger.error(`----- companyOperate getCompanyTree error = ${error} -----`);
            callback('请求已被服务器拒绝');
        }
    },

    getLoginCompanyTree: async (callback) => {

        try {
            const data = await conn.query(
                `select  id, name, parentId, sort, remark, name as title, id as value, id as 'key'  from sys_companies where deletedAt is null order by sort asc,createdAt asc
            `, { type: sequelize.QueryTypes.SELECT }
            ).then((result) => {
                return result;
            })

            // 只要没有人为改变数据库id，最小id值即为最上级公司
            const minId = Math.min.apply(Math, data.map(function (o) { return o.id }))
            //取最上级公司节点
            const node = data.filter((item) => {
                return item.id === minId;
            })[0]

            const result = buildTree([node], data).sort((a, b) => a.sort - b.sort);
            if (result) {
                return callback(null, result);
            } else {
                return callback(null, []);
            }
        } catch (error) {
            logger.error(`----- companyOperate getCompanyTree error = ${error} -----`);
            callback('请求已被服务器拒绝');
        }
    },

    getCompanyById: async (id, callback) => {

        try {
            const company = await Company.findOne({
                where: { id },
            }).then((item) => {
                return item;
            });

            return callback(null, company);
        } catch (error) {
            logger.error(`----- companyOperate getCompanyById error = ${error} -----`);
            return callback('请求已被服务器拒绝');
        }
    },

    companyCreate: async (name, parentId, sort, remark, callback) => {

        let data = {
            name,
            sort,
            remark
        };

        if (parentId === '0' || parentId === 0) {
            data.parentId = 0;
            data.treeId = '[0]';
            data.isLeaf = true;

            try {
                const result = await Company.create(data).then((result) => {
                    return result;
                })

                const adminUser = await User.create({ loginName: 'admin', displayName: '超级管理员', password: 'fb71dec4e0f6ca87c720ff11ed8faa59c824f48f', gender: '1', status: '1', companyId: result.id }).then((users) => {
                    return users;
                })

                return callback(null, '创建成功。');
            } catch (error) {
                logger.error(`----- companyOperate companyCreate first try catch error = ${error} -----`);
                return callback('请求已被服务器拒绝');
            }
        } else {
            let parentNode = await Company.findOne({ where: { id: parentId } }).then((parentNode) => {
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
                const createResult = await Company.create(data, { transaction: trans }).then((result) => {
                    return result;
                })

                const updateResult = await Company.update(
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

                const adminUser = await User.create({ loginName: 'admin', displayName: '超级管理员', password: 'fb71dec4e0f6ca87c720ff11ed8faa59c824f48f', gender: '1', status: '1', companyId: createResult.id }, { transaction: trans }).then((users) => {
                    return users;
                })

                trans.commit();
                return callback(null, '创建成功。');

            } catch (error) {
                trans.rollback();

                logger.error(`----- companyOperate companyCreate second try catch error = ${error} -----`);
                return callback('请求已被服务器拒绝');
            }
        }
    },

    companyEdit: async (id, name, sort, remark, callback) => {
        try {
            const result = await Company.update(
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
            logger.error(`----- companyOperate companyEdit error = ${error} -----`);
            return callback('请求已被服务器拒绝');
        }
    },

    companyDelete: async (id, callback) => {

        const deleteCompany = await Company.findOne({
            where: {
                id
            }
        });

        const parentId = deleteCompany.parentId;

        const trans = await conn.transaction({
            autocommit: false
        }).then((trans) => {
            return trans;
        })

        try {
            await Company.destroy({
                where: {
                    id
                },
                transaction: trans,
                force: false // 真删除标记,此处用软删除
            })

            // 必须包含在事务中，如果不包含在事务中可以查询到删除的公司，因为事务没提交，还没真正提交，包含在事务内则查询不到
            const children = await Company.findAll({
                where: { parentId },
                transaction: trans,
            }).then((result) => {
                return result;
            })

            if (children.length < 1) {
                await Company.update(
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

            logger.error(`----- companyOperate companyDelete try catch error = ${error} -----`);
            return callback('请求已被服务器拒绝');
        }
    }
}
