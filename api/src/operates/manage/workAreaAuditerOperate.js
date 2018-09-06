const sequelize = require('sequelize')
const logger = require('../../common/logger')
const WorkAreaAuditer = require('../../models/workAreaAuditerModel')
const WorkArea = require('../../models/workAreaModel')

const dbConn = require('../../common/dbConn')
const conn = dbConn.getConn()

// 效率及其低下的构建树形结构
function buildTree(data) {
    const tree = {}

    for (const item of data) {
        if (!item.isLeaf) {
            item.children = []
            tree[item.id] = item
        }

        if (item.parentid === 0 && item.isLeaf) {
            tree[item.id] = item
        }
    }

    for (const item of data) {
        if (tree[item.parentid]) {
            tree[item.parentid].children.push(item)
        }
    }

    const rtnTree = []

    for (const i in tree) {
        if (tree.hasOwnProperty(i)) { // filter,只输出man的私有属性
            if (tree[i].parentid === 0) {
                rtnTree.push(tree[i])
            }
        }
    }

    return rtnTree
}

module.exports = {
    getWorkAreaTree: (callback) => {
        conn.query(
            `select  id, name, parentid, treeid, isLeaf, sort, remark from workareas where deletedAt is null order by sort asc,createdAt asc
        `, { type: sequelize.QueryTypes.SELECT }
        ).then((result) => {
            const success = buildTree(result).sort((a, b) => a.sort - b.sort)
            return callback(null, success)
        })
    },

    getWorkAreaById: (id, callback) => {
        WorkArea.findOne({
            where: { id },
        }).then((success) => {
            return callback(null, success)
        }).catch((error) => {

            logger.error(`----- workAreaAuditerOperate getWorkAreaById error = ${error} -----`)
            return callback('请求已被服务器拒绝')
        })
    },

    workAreaCreate: (name, parentid, sort, callback) => {
        let data = {
            name
        }

        if (parentid === '0' || parentid === 0) {
            data.parentid = 0
            data.treeid = '[0]'
            data.isLeaf = true
            data.sort = sort

            WorkArea.create(data).then(() => {
                return callback(null, '创建成功。')
            }).catch((error) => {

                logger.error(`----- workAreaAuditerOperate workAreaCreate error = ${error} -----`)
                return callback('请求已被服务器拒绝')
            })
        } else {
            WorkArea.findOne({ where: { id: parentid } }).then((parentNode) => {
                if (!parentNode) {
                    parentNode = { id: 0, treeid: '' }
                }

                data.parentid = parentNode.id
                data.treeid = parentNode.treeid ? `${parentNode.treeid},[${parentNode.id}]` : `$[${parentNode.id}]` // 如果存1,2,3,4,11,13，则查询会出问题,如果存[1],[2],[3],[4],[11],[13]查询时加上[]则没有问题
                data.isLeaf = true
                data.sort = sort

                parentNode.isLeaf = false

                conn.transaction({
                    autocommit: false
                }).then((trans) => {
                    WorkArea.create(data, { transaction: trans }).then(() => {
                        WorkArea.update(
                            {
                                isLeaf: false
                            },
                            {
                                where: { id: parentNode.id },
                                transaction: trans
                            }
                        ).then(() => {
                            trans.commit()
                            return callback(null, '创建成功。')
                        }).catch((error) => {

                            logger.error(`----- workAreaAuditerOperate workAreaCreate error = ${error} -----`)
                            trans.rollback()
                            return callback('请求已被服务器拒绝')
                        })
                    }).catch((error) => {

                        logger.error(`----- workAreaAuditerOperate workAreaCreate error = ${error} -----`)
                        trans.rollback()
                        return callback('请求已被服务器拒绝')
                    })
                })
            })
        }
    },

    workAreaEdit: (id, name, sort, callback) => {
        WorkArea.update(
            {
                name,
                sort
            },
            {
                where: { id },
            }
        ).then(() => {
            WorkAreaAuditer.update(
                {
                    workAreaName: name,
                },
                {
                    where: { waid: id },
                }
            ).then(() => {
                return callback(null, '更新成功')
            }).catch((error) => {

                logger.error(`----- workAreaAuditerOperate workAreaEdit error = ${error} -----`)
                return callback('请求已被服务器拒绝')
            })
        }).catch((error) => {

            logger.error(`----- workAreaAuditerOperate workAreaEdit error = ${error} -----`)
            return callback('请求已被服务器拒绝')
        })
    },

    workAreaDelete: (id, callback) => {

        WorkArea.findOne({
            where: { id }
        }).then((deleteItem) => {
            WorkArea.findOne({
                where: { id: deleteItem.parentid }
            }).then((parentItem) => {

                WorkArea.findAll({
                    where: { parentid: id }
                }).then((result) => {
                    if (result.length > 0) {
                        return callback('删除失败，请先删除该节点下的子节点。')
                    } else {
                        conn.transaction({
                            autocommit: false
                        }).then((trans) => {
                            WorkArea.destroy(
                                {
                                    where: { id },
                                    transaction: trans,
                                    force: true // 真删除标记
                                }
                            ).then(() => {
                                WorkAreaAuditer.destroy({
                                    where: { waid: id },
                                    transaction: trans,
                                    force: true // 真删除标记
                                }).then(() => {
                                    WorkArea.findAll({
                                        where: {
                                            parentid: parentItem ? parentItem.id : '',
                                            id: { ne: id }
                                        }
                                    }).then((children) => {
                                        if (children.length < 1) {
                                            WorkArea.update(
                                                { isLeaf: true },
                                                {
                                                    where: { id: parentItem ? parentItem.id : '' },
                                                    transaction: trans,
                                                }
                                            ).then(() => {
                                                trans.commit()
                                                return callback(null, '删除成功')
                                            }).catch((error) => {
                                                trans.rollback()
                                                logger.error(`----- workAreaAuditerOperate workAreaDelete error = ${error} -----`)
                                                return callback('请求已被服务器拒绝')
                                            })
                                        } else {
                                            trans.commit()
                                            return callback(null, '删除成功')
                                        }
                                    })

                                }).catch((error) => {
                                    trans.rollback()
                                    logger.error(`----- workAreaAuditerOperate workAreaDelete error = ${error} -----`)
                                    return callback('请求已被服务器拒绝')
                                })
                            }).catch((error) => {
                                trans.rollback()
                                logger.error(`----- workAreaAuditerOperate workAreaDelete error = ${error} -----`)
                                return callback('请求已被服务器拒绝')
                            })
                        })
                    }
                })
            })
        })
    },

    workAreaAuditerCreate: (auditName, auditPhone, waid, callback) => {
        WorkArea.findOne({
            where: { id: waid }
        }).then((area) => {
            if (area) {
                WorkAreaAuditer.findOne({
                    where: { auditPhone }
                }).then((auditer) => {
                    if (auditer) {
                        return callback(`添加失败，${auditPhone}名为${auditer.auditName}的管理员已存在，所在区域为${auditer.workAreaName}`)
                    } else {
                        const data = { auditName, auditPhone, waid, workAreaName: area.name, treeid: area.treeid }
                        WorkAreaAuditer.create(data).then(() => {
                            return callback(null, '创建成功。')
                        }).catch((error) => {

                            logger.error(`----- workAreaAuditerOperate workAreaCreate error = ${error} -----`)
                            return callback('请求已被服务器拒绝')
                        })
                    }
                })
            } else {
                return callback('添加失败，节点已被删除，请重新刷新界面。')
            }
        })
    },

    workAreaAuditerEdit: (id, auditName, callback) => {
        WorkAreaAuditer.findOne({
            where: { id }
        }).then((auditer) => {
            if (auditer) {
                WorkAreaAuditer.update(
                    {
                        auditName,
                    },
                    {
                        where: { id },
                    }
                ).then(() => {
                    return callback(null, '更新成功')
                }).catch((error) => {

                    logger.error(`----- workAreaAuditerOperate workAreaAuditerEdit error = ${error} -----`)
                    return callback('请求已被服务器拒绝')
                })
            } else {
                return callback('编辑失败，管理员已被删除，请重新刷新界面。')
            }
        })
    },

    workAreaAuditerDelete: (id, callback) => {
        WorkAreaAuditer.destroy({
            where: { id },
            force: true // 真删除标记
        }).then(() => {
            return callback(null, '删除成功')
        }).catch((error) => {

            logger.error(`----- workAreaAuditerOperate workAreaAuditerDelete error = ${error} -----`)
            return callback('请求已被服务器拒绝')
        })
    },

    getAuditerListByAreaId: (waid, callback) => {
        WorkAreaAuditer.findAll({
            where: { waid },
            order: 'createdAt asc'
        }).then((success) => {
            return callback(null, success)
        }).catch((error) => {

            logger.error(`----- workAreaAuditerOperate getAuditerListByAreaId error = ${error} -----`)
            return callback('请求已被服务器拒绝')
        })
    },

    getAuditerById: (id, callback) => {
        WorkAreaAuditer.findOne({
            where: { id },
        }).then((success) => {
            return callback(null, success)
        }).catch((error) => {

            logger.error(`----- workAreaAuditerOperate getAuditerById error = ${error} -----`)
            return callback('请求已被服务器拒绝')
        })
    }

}
