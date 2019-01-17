const sequelize = require('sequelize')
const logger = require('../../../common/logger')
const Menu = require('../../../models/system/menuModel')
const Sys_Menu_Permission = require('../../../models/system/sys_menu_permission')

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
    getMenuTree: async (callback) => {

        try {
            const data = await conn.query(
                `select  id, name, menuLink, icon, parentId, treeId, isLeaf, sort, remark from sys_menus where deletedAt is null order by sort asc,createdAt asc
            `, { type: sequelize.QueryTypes.SELECT }
            ).then((result) => {
                return result;
            })

            const result = buildTree([{ id: 0, name: '导航路由' }], data).sort((a, b) => a.sort - b.sort);
            if (result[0].children) {
                return callback(null, result[0].children);
            } else {
                return callback(null, []);
            }
        } catch (error) {
            logger.error(`----- menuOperate getMenuTree error = ${error} -----`);
            callback('请求已被服务器拒绝');
        }
    },

    getMenuById: async (id, callback) => {

        try {
            const menu = await Menu.findOne({
                where: { id },
            }).then((item) => {
                return item;
            });

            return callback(null, menu);
        } catch (error) {
            logger.error(`----- menuOperate getMenuById error = ${error} -----`);
            return callback('请求已被服务器拒绝');
        }
    },

    menuCreate: async (name, menuLink, comPath, icon, parentId, sort, menuType, menuTypeDesc, companyId, callback) => {

        let data = {
            name,
            menuLink,
            comPath,
            icon,
            sort,
            menuType,
            menuTypeDesc,
            companyId
        };

        if (parentId === '0' || parentId === 0) {
            data.parentId = 0;
            data.treeId = '[0]';
            data.isLeaf = true;

            try {
                const result = await Menu.create(data).then((result) => {
                    return result;
                })

                return callback(null, '创建成功。');
            } catch (error) {
                logger.error(`----- menuOperate menuCreate first try catch error = ${error} -----`);
                return callback('请求已被服务器拒绝');
            }
        } else {
            let parentNode = await Menu.findOne({ where: { id: parentId } }).then((parentNode) => {
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
                const createResult = await Menu.create(data, { transaction: trans }).then((result) => {
                    return result;
                })

                const updateResult = await Menu.update(
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

                logger.error(`----- menuOperate menuCreate second try catch error = ${error} -----`);
                return callback('请求已被服务器拒绝');
            }
        }
    },

    menuEdit: async (id, name, menuLink, comPath, icon, sort, menuType, menuTypeDesc, callback) => {
        try {
            const result = await Menu.update(
                {
                    name,
                    menuLink,
                    comPath,
                    icon,
                    sort,
                    menuType,
                    menuTypeDesc
                },
                {
                    where: { id },
                }
            ).then((result) => {
                return result;
            })

            await Sys_Menu_Permission.update(
                {
                    menuName: name,
                    menuType,
                    menuTypeDesc
                },
                {
                    where: { menuId: id },
                }
            )

            return callback(null, '更新成功');
        } catch (error) {
            logger.error(`----- menuOperate menuEdit error = ${error} -----`);
            return callback('请求已被服务器拒绝');
        }
    },

    menuDelete: async (id, callback) => {

        const deleteMenu = await Menu.findOne({
            where: {
                id
            }
        });

        const parentId = deleteMenu.parentId;

        const trans = await conn.transaction({
            autocommit: false
        }).then((trans) => {
            return trans;
        })

        try {
            await Menu.destroy({
                where: {
                    id
                },
                transaction: trans,
                force: true // 真删除标记
            })

            await Sys_Menu_Permission.destroy({
                where: {
                    menuId: id
                },
                transaction: trans,
                force: true // 真删除标记
            })

            // 必须包含在事务中，如果不包含在事务中可以查询到删除的菜单，因为事务没提交，还没真正提交，包含在事务内则查询不到
            const children = await Menu.findAll({
                where: { parentId },
                transaction: trans,
            }).then((result) => {
                return result;
            })

            if (children.length < 1) {
                await Menu.update(
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

            logger.error(`----- menuOperate menuDelete try catch error = ${error} -----`);
            return callback('请求已被服务器拒绝');
        }
    }
}
