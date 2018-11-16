const { trim } = require('lodash')
const companyOperate = require('../../../operates/manage/system/companyOperate')

module.exports = {

    getCompanyTree: (req, res) => {
        companyOperate.getCompanyTree((error, success) => {
            res.type = 'json';

            if (error) {
                res.status(200).json({ error });
            } else {
                res.status(200).json({ success });
            }
        })
    },

    getCompanyById: (req, res) => {
        const id = req.body.id
        companyOperate.getCompanyById(id, (error, success) => {
            res.type = 'json';

            if (error) {
                res.status(200).json({ error });
            } else {
                res.status(200).json({ success });
            }
        })
    },

    companyCreate: (req, res) => {
        const name = trim(req.body.name);
        const parentId = trim(req.body.parentId);
        const sort = trim(req.body.sort);
        const remark = trim(req.body.remark);

        res.type = 'json';
        companyOperate.companyCreate(name, parentId, sort, remark, (error, success) => {
            if (error) {
                res.status(200).json({ error });
            } else {
                res.status(200).json({ success });
            }
        })
    },

    companyEdit: (req, res) => {
        const id = trim(req.body.id);
        const name = trim(req.body.name);
        const sort = trim(req.body.sort);
        const remark = trim(req.body.remark);

        res.type = 'json';
        companyOperate.companyEdit(id, name, sort, remark, (error, success) => {

            if (error) {
                res.status(200).json({ error });
            } else {
                res.status(200).json({ success });
            }
        })
    },

    companyDelete: (req, res) => {
        const idArry = req.body.idArry ? JSON.parse(req.body.idArry) : [];

        res.type = 'json'
        companyOperate.companyDelete(idArry, (error, success) => {

            if (error) {
                res.status(200).json({ error });
            } else {
                res.status(200).json({ success });
            }
        })
    },
}
