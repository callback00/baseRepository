const path = require('path')

const redisUtility = require('../../src/common/redisUtility');
const file = require('../../src/common/file');

const loginController = require('../../src/controllers/manage/loginController')
const userController = require('../../src/controllers/manage/userController')
// const tempFileController = require('../../src/controllers/file/tempFileController')

const memberController = require('../../src/controllers/manage/memberController')
const workAreaAuditerController = require('../../src/controllers/manage/workAreaAuditerController')
const auditLogController = require('../../src/controllers/manage/auditLogController')
const wxHomeInfoController = require('../../src/controllers/manage/wxHomeInfoController')

const multipart = require('connect-multiparty')

module.exports = (router, app, config) => {

    // 需自己创建临时文件夹
    file.mkdir(['tempFile'])
    // 设置临时文件夹目录，multipart组件会自动将上传的文件存储在临时文件夹中，所以当文件转移到正式文件夹后记得删除临时文件夹的内容
    const multipartMiddleware = multipart({ uploadDir: path.resolve(config.rootPath, '../file/tempFile') })

    const loginExpired = (res) => {
        res.type = 'json';
        res.status(401).json({ error: '用户登录已过期，请重新登录!' });
    };

    // 自定义 弱权限校验 中间件，只校验是否登录
    const weakCheck = (req, res, next) => {
        if (req.sessionID) {
            next()
        } else {
            loginExpired(res)
        }
    }

    // 自定义 获取操作用户userid 中间件
    const getUserid = (req, res, next) => {
        redisUtility.getUser(req.sessionID, (current) => {
            if (current) {
                req.userid = current.userid
            }

            next()
        })
    }

    // 自定义 强权限校验 中间件,校验权限
    const strongCheck = (req, res, next) => {
        // 判断用户是否有权限访问的公用逻辑
        if (config.auth) {

            redisUtility.getUser(req.sessionID, (current) => {
                if (current && current.permission) {
                    // console.log(current.permission)
                    const isLogin = current.permission.some((data) => {
                        return req.originalUrl.match(data) !== null
                    })

                    if (isLogin) {
                        next()
                        return
                    }
                }

                res.type = 'json'
                res.status(200).json({ auth: '登录失效!', error: '用户没有权限执行此操作!' })
            })

        } else {
            next()
        }
    }

    // 自定义 获取操作用户user 中间件
    const getUser = (req, res, next) => {
        redisUtility.getUser(req.sessionID, (current) => {
            if (current) {
                req.user = current;
            }
            next();
        })
    }

    // 单独处理登出请求，无需权限控制，直接销毁对应的登录内容
    router.use('/logout', (req, res) => {
        res.status(200).end()
        if (config.auth) {
            redisUtility.deleteUser(req.sessionID)
        }
    })

    // 后台 API
    router
        .post('/login', loginController.login)
        .post('/password', weakCheck, getUserid, loginController.updatePassword)

    router
        .put('/user/create', strongCheck, userController.createUser)
        .put('/user/update', strongCheck, userController.updateUser)
        .delete('/user/delete', strongCheck, userController.deleteUser)
        .post('/user/info', strongCheck, userController.getUserInfo)
        .post('/user/list', strongCheck, userController.getUserList)
        .post('/user/rule', strongCheck, userController.getRuleList)

    router
        .post('/member/getMemberList', weakCheck, memberController.getMemberList)

    // router
    //     .post('/tempFile/baseUpload', multipartMiddleware, weakCheck, tempFileController.baseUpload)

    router
        .get('/workAreaAuditer/getWorkAreaTree', weakCheck, workAreaAuditerController.getWorkAreaTree)
        .post('/workAreaAuditer/getWorkAreaById', weakCheck, workAreaAuditerController.getWorkAreaById)
        .post('/workAreaAuditer/workAreaCreate', weakCheck, workAreaAuditerController.workAreaCreate)
        .post('/workAreaAuditer/workAreaEdit', weakCheck, workAreaAuditerController.workAreaEdit)
        .delete('/workAreaAuditer/workAreaDelete', weakCheck, workAreaAuditerController.workAreaDelete)

    router
        .post('/workAreaAuditer/getAuditerListByAreaId', weakCheck, workAreaAuditerController.getAuditerListByAreaId)
        .post('/workAreaAuditer/getAuditerById', weakCheck, workAreaAuditerController.getAuditerById)
        .post('/workAreaAuditer/workAreaAuditerCreate', weakCheck, workAreaAuditerController.workAreaAuditerCreate)
        .post('/workAreaAuditer/workAreaAuditerEdit', weakCheck, workAreaAuditerController.workAreaAuditerEdit)
        .delete('/workAreaAuditer/workAreaAuditerDelete', weakCheck, workAreaAuditerController.workAreaAuditerDelete)

    router
        .post('/auditLog/getAuditLogList', weakCheck, auditLogController.getAuditLogList)

    router
        .post('/wxHomeInfo/createScenic', weakCheck, wxHomeInfoController.createScenic)
}