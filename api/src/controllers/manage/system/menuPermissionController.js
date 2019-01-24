const { trim } = require('lodash')
const menuPermissionOperate = require('../../../operates/manage/system/menuPermissionOperate')

module.exports = {

    // 获取导航栏目，对于拥有权限的栏目，permissionFlag标志为true
    // 根据传入的userId返回相应数据
    getMenuPermissionTree: (req, res) => {

        const userId = trim(req.body.userId);
        menuPermissionOperate.getMenuPermissionTree(userId, (error, success) => {
            res.type = 'json';

            if (error) {
                res.status(200).json({ error });
            } else {
                res.status(200).json({ success });
            }
        })
    },

    permissionSave: (req, res) => {
        const userId = req.body.userId;
        const addKeyList = JSON.parse(trim(req.body.addKeyList))
        const deleteKeyList = JSON.parse(trim(req.body.deleteKeyList))
        const companyId = req.user.company.id

        res.type = 'json'
        menuPermissionOperate.permissionSave(addKeyList, deleteKeyList, userId, companyId, (error, success) => {

            if (error) {
                res.status(200).json({ error })
            } else {
                res.status(200).json({ success })
            }
        })
    },

    // 获取当前用户的菜单权限树
    getCurrentMenuPermission: (req, res) => {

        const userId = trim(req.user.userId);
        const company = req.user.company

        menuPermissionOperate.getCurrentMenuPermission(userId, company, (error, success) => {
            res.type = 'json';

            if (error) {
                res.status(200).json({ error });
            } else {
                res.status(200).json({ success });
            }
        })
    },
}
