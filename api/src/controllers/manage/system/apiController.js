const { trim } = require('lodash')
const apiOperate = require('../../../operates/manage/system/apiOperate')

module.exports = {

    getApiTree: (req, res) => {
        apiOperate.getApiTree((error, success) => {
            res.type = 'json';

            if (error) {
                res.status(200).json({ error });
            } else {
                res.status(200).json({ success });
            }
        })
    },

    getApiById: (req, res) => {
        const id = req.body.id
        apiOperate.getApiById(id, (error, success) => {
            res.type = 'json';

            if (error) {
                res.status(200).json({ error });
            } else {
                res.status(200).json({ success });
            }
        })
    },

    apiCreate: (req, res) => {
        const name = trim(req.body.name);
        const url = trim(req.body.url);
        const parentId = trim(req.body.parentId);
        const sort = trim(req.body.sort);

        res.type = 'json';
        apiOperate.apiCreate(name, url, parentId, sort, (error, success) => {

            if (error) {
                res.status(200).json({ error });
            } else {
                res.status(200).json({ success });
            }
        })
    },

    apiEdit: (req, res) => {
        const id = trim(req.body.id);
        const name = trim(req.body.name);
        const url = trim(req.body.url);
        const sort = trim(req.body.sort);

        res.type = 'json';
        apiOperate.apiEdit(id, name, url, sort, (error, success) => {

            if (error) {
                res.status(200).json({ error });
            } else {
                res.status(200).json({ success });
            }
        })
    },

    apiDelete: (req, res) => {
        const idArry = req.body.idArry ? JSON.parse(req.body.idArry) : [];

        res.type = 'json'
        apiOperate.apiDelete(idArry, (error, success) => {

            if (error) {
                res.status(200).json({ error });
            } else {
                res.status(200).json({ success });
            }
        })
    },
}
