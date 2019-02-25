const path = require('path')

const redisUtility = require('../../src/common/redisUtility');
const file = require('../../src/common/file');

const loginController = require('../../src/controllers/manage/user/loginController')
const userController = require('../../src/controllers/manage/user/userController')
const menuController = require('../../src/controllers/manage/system/menuController')
const menuPermissionController = require('../../src/controllers/manage/system/menuPermissionController')
const apiController = require('../../src/controllers/manage/system/apiController')
const apiPermissionController = require('../../src/controllers/manage/system/apiPermissionController')

const noticeController = require('../../src/controllers/manage/notice/noticeController')
const noticeDetailController = require('../../src/controllers/manage/notice/noticeDetailController')
// const tempFileController = require('../../src/controllers/file/tempFileController')

const memberController = require('../../src/controllers/manage/user/memberController')

const companyController = require('../../src/controllers/manage/system/companyController')

const roleController = require('../../src/controllers/manage/role/roleController')

const multipart = require('connect-multiparty')

const Api = require('../../src/models/system/apiModel')

module.exports = (router, app, config) => {

    // 需自己创建临时文件夹
    file.mkdir(['tempFile']);
    // 设置临时文件夹目录，multipart组件会自动将上传的文件存储在临时文件夹中，所以当文件转移到正式文件夹后记得删除临时文件夹的内容
    const multipartMiddleware = multipart({ uploadDir: path.resolve(config.rootPath, '../file/tempFile') });

    // 获取需要校验权限的api
    let apiList = [];
    Api.findAll({ where: { isLeaf: 1 } }).then((success) => {
        apiList = [...success];
    });

    const loginExpired = (res) => {
        res.type = 'json';
        res.status(401).json({ error: '用户登录已过期，请重新登录!' });
    };

    // 校验登录、权限的中间件，对于维护在api表中的路由进行用户权限校验，未维护在api表中的路由直接通过
    // 不再需要weakCheck
    const strongCheck = (req, res, next) => {
        redisUtility.getUser(req.sessionID, (user) => {
            if (user) {
                //管理端的api都自动获取当前用户和当前组织
                req.user = user;
                // 超级管理员无需api权限校验
                if (user.loginName === 'admin') {
                    next();
                    return
                } else {
                    // 为防止权限校验有bug，保留文本配置的功能，稳定后可去掉该判断
                    if (config.auth) {
                        // 判断当前url是否在需校验的列表里
                        const isCheckPermission = apiList.some((data) => {
                            return req.originalUrl.match(`/api${data.url}`) !== null;
                        })

                        // 如需校验api则校验用户api权限，否则next
                        if (isCheckPermission) {
                            if (user.apiPermissions) {
                                const isGoNext = user.apiPermissions.some((data) => {
                                    return req.originalUrl.match(`/api${data}`) !== null;
                                })

                                if (isGoNext) {
                                    next();
                                    return;
                                } else {
                                    res.type = 'json';
                                    res.status(403).json({ auth: '无权操作!', error: '用户没有权限执行此操作!' });
                                }
                            }
                        } else {
                            next();
                            return;
                        }
                    } else {
                        next();
                        return;
                    }
                }
            } else {
                loginExpired(res);
                return;
            }
        })
    }

    // 单独处理登出请求，无需权限控制，直接销毁对应的登录内容
    router.use('/logout', (req, res) => {
        res.status(200).end();
        if (config.auth) {
            redisUtility.deleteUser(req.sessionID);
        }
    });

    // 后台 API
    router
        .post('/login', loginController.login)
        .post('/password', strongCheck, loginController.updatePassword)
        .put('/updateMyInfo', strongCheck, userController.updateMyInfo)
        .get('/getMyInfo', strongCheck, userController.getMyInfo)
        .get('/login/getCompanyTree', companyController.getLoginCompanyTree)

    router
        .put('/user/create', strongCheck, userController.createUser)
        .put('/user/update', strongCheck, userController.updateUser)
        .delete('/user/delete', strongCheck, userController.deleteUser)
        .post('/user/info', strongCheck, userController.getUserInfo)
        .post('/user/list', strongCheck, userController.getUserList)

    router
        .get('/role/getRoleList', strongCheck, roleController.getRoleList)
        .post('/role/roleCreate', strongCheck, roleController.roleCreate)
        .post('/role/getRoleUserByRoleId', strongCheck, roleController.getRoleUserByRoleId)
        .post('/role/roleEdit', strongCheck, roleController.roleEdit)
        .delete('/role/roleDelete', strongCheck, roleController.roleDelete)
        .post('/role/getRoleById', strongCheck, roleController.getRoleById)
        .post('/role/roleUserEdit', strongCheck, roleController.roleUserEdit)
        .post('/role/getRoleMenuPermissionTree', strongCheck, roleController.getRoleMenuPermissionTree)
        .post('/role/roleMenuPermissionEdit', strongCheck, roleController.roleMenuPermissionEdit)
        .post('/role/getRoleApiPermissionTree', strongCheck, roleController.getRoleApiPermissionTree)
        .post('/role/roleApiPermissionEdit', strongCheck, roleController.roleApiPermissionEdit)

    router
        .get('/menu/getMenuTree', strongCheck, menuController.getMenuTree)
        .post('/menu/menuCreate', strongCheck, menuController.menuCreate)
        .post('/menu/menuEdit', strongCheck, menuController.menuEdit)
        .delete('/menu/menuDelete', strongCheck, menuController.menuDelete)
        .post('/menu/getMenuById', strongCheck, menuController.getMenuById)

    router
        .get('/apiManage/getApiTree', strongCheck, apiController.getApiTree)
        .post('/apiManage/apiCreate', strongCheck, apiController.apiCreate)
        .post('/apiManage/apiEdit', strongCheck, apiController.apiEdit)
        .delete('/apiManage/apiDelete', strongCheck, apiController.apiDelete)
        .post('/apiManage/getApiById', strongCheck, apiController.getApiById)

    router
        .post('/menuPermission/getMenuPermissionTree', strongCheck, menuPermissionController.getMenuPermissionTree)
        .post('/menuPermission/permissionSave', strongCheck, menuPermissionController.permissionSave)
        .post('/menuPermission/getCurrentMenuPermission', strongCheck, menuPermissionController.getCurrentMenuPermission)

    router
        .post('/apiPermission/getApiPermissionTree', strongCheck, apiPermissionController.getApiPermissionTree)
        .post('/apiPermission/permissionSave', strongCheck, apiPermissionController.permissionSave)
        .post('/apiPermission/getCurrentapiPermission', strongCheck, apiPermissionController.getCurrentApiPermission)

    router
        .post('/noticeManage/noticeCreate', strongCheck, noticeController.noticeCreate)
        .post('/noticeManage/noticeEdit', strongCheck, noticeController.noticeEdit)
        .delete('/noticeManage/noticeDelete', strongCheck, noticeController.noticeDelete)
        .post('/noticeManage/getNoticeById', strongCheck, noticeController.getNoticeById)
        .post('/noticeManage/getNoticeList', strongCheck, noticeController.getNoticeList)
        .post('/noticeManage/sendTemplateNoticeDetail', strongCheck, noticeDetailController.sendTemplateNoticeDetail)

    router
        .get('/noticeDetail/getUserUnReadNoticeList', strongCheck, noticeDetailController.getUserUnReadNoticeList)
        .post('/noticeDetail/getUserAllNoticeList', strongCheck, noticeDetailController.getUserAllNoticeList)
        .post('/noticeDetail/updateReadFlag', strongCheck, noticeDetailController.updateReadFlag)

    router
        .post('/member/getMemberList', strongCheck, memberController.getMemberList)

    router
        .get('/company/getCompanyTree', strongCheck, companyController.getCompanyTree)
        .post('/company/companyCreate', strongCheck, companyController.companyCreate)
        .post('/company/companyEdit', strongCheck, companyController.companyEdit)
        .delete('/company/companyDelete', strongCheck, companyController.companyDelete)
        .post('/company/getCompanyById', strongCheck, companyController.getCompanyById)

    // router
    //     .post('/tempFile/baseUpload', multipartMiddleware, weakCheck, tempFileController.baseUpload)
}