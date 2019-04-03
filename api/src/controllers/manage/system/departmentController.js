const { trim } = require('lodash')
const departmentOperate = require('../../../operates/manage/system/departmentOperate')

module.exports = {

    getDepartmentTree: (req, res) => {
        const companyId = req.user.company.id
        departmentOperate.getDepartmentTree(companyId, (error, success) => {
            res.type = 'json';

            if (error) {
                res.status(200).json({ error });
            } else {
                res.status(200).json({ success });
            }
        })
    },

    getDepartmentById: (req, res) => {
        const id = req.body.id
        departmentOperate.getDepartmentById(id, (error, success) => {
            res.type = 'json';

            if (error) {
                res.status(200).json({ error });
            } else {
                res.status(200).json({ success });
            }
        })
    },

    departmentCreate: (req, res) => {
        const companyId = req.user.company.id
        const name = trim(req.body.name);
        const parentId = trim(req.body.parentId);
        const sort = trim(req.body.sort);
        const remark = trim(req.body.remark);

        res.type = 'json';
        departmentOperate.departmentCreate(name, parentId, sort, remark, companyId, (error, success) => {
            if (error) {
                res.status(200).json({ error });
            } else {
                res.status(200).json({ success });
            }
        })
    },

    departmentEdit: (req, res) => {
        const id = trim(req.body.id);
        const name = trim(req.body.name);
        const sort = trim(req.body.sort);
        const remark = trim(req.body.remark);

        res.type = 'json';
        departmentOperate.departmentEdit(id, name, sort, remark, (error, success) => {

            if (error) {
                res.status(200).json({ error });
            } else {
                res.status(200).json({ success });
            }
        })
    },

    departmentDelete: (req, res) => {
        const idArry = req.body.idArry ? JSON.parse(req.body.idArry) : [];

        res.type = 'json'

        departmentOperate.departmentDelete(idArry, (error, success) => {

            if (error) {
                res.status(200).json({ error });
            } else {
                res.status(200).json({ success });
            }
        })
    },
}
