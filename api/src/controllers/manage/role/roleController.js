const { trim } = require('lodash')
const roleOperate = require('../../../operates/manage/role/roleOperate')

module.exports = {

    getRoleList: (req, res) => {
        const companyId = req.user.company.id
        roleOperate.getRoleList(companyId, (error, success) => {
            res.type = 'json';

            if (error) {
                res.status(200).json({ error });
            } else {
                res.status(200).json({ success });
            }
        })
    },

    getRoleById: (req, res) => {
        const id = req.body.id
        roleOperate.getRoleById(id, (error, success) => {
            res.type = 'json';

            if (error) {
                res.status(200).json({ error });
            } else {
                res.status(200).json({ success });
            }
        })
    },

    roleCreate: (req, res) => {
        const name = trim(req.body.name);
        const remark = trim(req.body.remark);
        const companyId = req.user.company.id

        res.type = 'json';
        roleOperate.roleCreate(name, remark, companyId, (error, success) => {

            if (error) {
                res.status(200).json({ error });
            } else {
                res.status(200).json({ success });
            }
        })
    },

    roleEdit: (req, res) => {
        const id = trim(req.body.id);
        const name = trim(req.body.name);
        const remark = trim(req.body.remark);

        res.type = 'json';
        roleOperate.roleEdit(id, name, remark, (error, success) => {

            if (error) {
                res.status(200).json({ error });
            } else {
                res.status(200).json({ success });
            }
        })
    },

    roleDelete: (req, res) => {
        const idArry = req.body.idArry ? JSON.parse(req.body.idArry) : [];

        res.type = 'json'
        roleOperate.roleDelete(idArry, (error, success) => {

            if (error) {
                res.status(200).json({ error });
            } else {
                res.status(200).json({ success });
            }
        })
    },

    getRoleUserByRoleId: (req, res) => {
        const roleId = trim(req.body.roleId);
        const companyId = req.user.company.id;
        res.type = 'json';

        roleOperate.getRoleUserByRoleId(roleId, companyId, (error, success) => {

            if (error) {
                res.status(200).json({ error });
            } else {
                res.status(200).json({ success });
            }
        })
    },

    roleUserEdit: (req, res) => {
        const roleId = req.body.roleId; // 角色id
        const userIdList = req.body.userIdList ? JSON.parse(req.body.userIdList) : [];;
        const companyId = req.user.company.id;

        res.type = 'json';
        roleOperate.roleUserEdit(roleId, userIdList, companyId, (error, success) => {

            if (error) {
                res.status(200).json({ error });
            } else {
                res.status(200).json({ success });
            }
        })
    },

    // 获取导航栏目，对于拥有权限的栏目，permissionFlag标志为true
    // 根据传入的userId返回相应数据
    getRoleMenuPermissionTree: (req, res) => {

        const roleId = trim(req.body.roleId);
        roleOperate.getRoleMenuPermissionTree(roleId, (error, success) => {
            res.type = 'json';

            if (error) {
                res.status(200).json({ error });
            } else {
                res.status(200).json({ success });
            }
        })
    },

    roleMenuPermissionEdit: (req, res) => {
        const roleId = req.body.roleId;
        const addKeyList = JSON.parse(trim(req.body.addKeyList))
        const deleteKeyList = JSON.parse(trim(req.body.deleteKeyList))
        const companyId = req.user.company.id
        res.type = 'json'
        roleOperate.roleMenuPermissionEdit(addKeyList, deleteKeyList, roleId, companyId, (error, success) => {

            if (error) {
                res.status(200).json({ error })
            } else {
                res.status(200).json({ success })
            }
        })
    },

    // 根据传入的userId返回相应数据
    getRoleApiPermissionTree: (req, res) => {

        const roleId = trim(req.body.roleId);
        roleOperate.getRoleApiPermissionTree(roleId, (error, success) => {
            res.type = 'json';

            if (error) {
                res.status(200).json({ error });
            } else {
                res.status(200).json({ success });
            }
        })
    },

    roleApiPermissionEdit: (req, res) => {
        const roleId = req.body.roleId;
        const addKeyList = JSON.parse(trim(req.body.addKeyList))
        const deleteKeyList = JSON.parse(trim(req.body.deleteKeyList))
        const companyId = req.user.company.id
        res.type = 'json'
        roleOperate.roleApiPermissionEdit(addKeyList, deleteKeyList, roleId, companyId, (error, success) => {

            if (error) {
                res.status(200).json({ error })
            } else {
                res.status(200).json({ success })
            }
        })
    },

}
