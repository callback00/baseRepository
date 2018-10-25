const { trim } = require('lodash')
const apiPermissionOperate = require('../../../operates/manage/system/apiPermissionOperate')

module.exports = {

    // 根据传入的userId返回相应数据
    getApiPermissionTree: (req, res) => {

        const userId = trim(req.body.userId);
        apiPermissionOperate.getApiPermissionTree(userId, (error, success) => {
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

        res.type = 'json'
        apiPermissionOperate.permissionSave(addKeyList, deleteKeyList, userId, (error, success) => {

            if (error) {
                res.status(200).json({ error })
            } else {
                res.status(200).json({ success })
            }
        })
    },

    // 获取当前用户的菜单权限树
    getCurrentApiPermission: (req, res) => {

        const userId = trim(req.user.userId);
        apiPermissionOperate.getCurrentApiPermission(userId, (error, success) => {
            res.type = 'json';

            if (error) {
                res.status(200).json({ error });
            } else {
                res.status(200).json({ success });
            }
        })
    },
}
