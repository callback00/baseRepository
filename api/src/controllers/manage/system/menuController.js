const { trim } = require('lodash');
const menuOperate = require('../../../operates/manage/system/menuOperate');

module.exports = {

    getMenuTree: (req, res) => {
        menuOperate.getMenuTree((error, success) => {
            res.type = 'json';

            if (error) {
                res.status(200).json({ error });
            } else {
                res.status(200).json({ success });
            }
        })
    },

    getMenuById: (req, res) => {
        const id = req.body.id
        menuOperate.getMenuById(id, (error, success) => {
            res.type = 'json';

            if (error) {
                res.status(200).json({ error });
            } else {
                res.status(200).json({ success });
            }
        })
    },

    menuCreate: (req, res) => {
        const name = trim(req.body.name);
        const menuLink = trim(req.body.menuLink);
        const comPath = trim(req.body.comPath);
        const icon = trim(req.body.icon);
        const parentId = trim(req.body.parentId);
        const sort = trim(req.body.sort);
        const menuType = trim(req.body.menuType);
        const menuTypeDesc = menuType === '1' ? '导航路由' : '页面路由';

        const companyId = req.user.company.id

        res.type = 'json';
        menuOperate.menuCreate(name, menuLink, comPath, icon, parentId, sort, menuType, menuTypeDesc, companyId, (error, success) => {

            if (error) {
                res.status(200).json({ error });
            } else {
                res.status(200).json({ success });
            }
        })
    },

    menuEdit: (req, res) => {
        const id = trim(req.body.id);
        const name = trim(req.body.name);
        const menuLink = trim(req.body.menuLink);
        const comPath = trim(req.body.comPath);
        const icon = trim(req.body.icon);
        const sort = trim(req.body.sort);
        const menuType = trim(req.body.menuType);
        const menuTypeDesc = menuType === '1' ? '导航路由' : '页面路由';

        res.type = 'json';
        menuOperate.menuEdit(id, name, menuLink, comPath, icon, sort, menuType, menuTypeDesc, (error, success) => {

            if (error) {
                res.status(200).json({ error });
            } else {
                res.status(200).json({ success });
            }
        })
    },

    menuDelete: (req, res) => {
        const idArry = req.body.idArry ? JSON.parse(req.body.idArry) : [];

        res.type = 'json'
        menuOperate.menuDelete(idArry, (error, success) => {

            if (error) {
                res.status(200).json({ error });
            } else {
                res.status(200).json({ success });
            }
        })
    },
}
