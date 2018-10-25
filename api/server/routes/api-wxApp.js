const redisUtility = require('../../src/common/redisUtility');

const mobileAuth = require('../../src/controllers/wx/authController')
const memberController = require('../../src/controllers/wx/memberController')
const auditController = require('../../src/controllers/wx/auditController')
module.exports = (router, app, config) => {

    const loginExpired = (res) => {
        res.type = 'json';
        res.status(401).json({ error: '用户登录已过期，请重新登录!' });
    };

    // 自定义 弱权限校验 中间件
    const weakCheck = (req, res, next) => {
        // console.log(req.sessionID)
        if (req.sessionID) {
            next();
        } else {
            loginExpired(res);
        }
    }

    // 自定义 微信小程序登录赋值 中间件
    const getWXOpenid = (req, res, next) => {
        req.wxOpenid = req.sessionID;
        next();
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


    // 微信 API
    router
        .post('/wxapp/login', mobileAuth.wxappLogin)
        .post('/wxapp/login/send', mobileAuth.sendCode)

    router
        .post('/wxapp/member/QRInfo', weakCheck, getUser, memberController.getWXQr)
        .post('/wxapp/member/getMemberInfoByMobile', weakCheck, getUser, memberController.getMemberInfoByMobile)

    router
        .get('/wxapp/auditer/getAuditerInfo', weakCheck, getUser, auditController.getAuditerInfo)
        .post('/wxapp/auditer/handleAudit', weakCheck, getUser, auditController.handleAudit)
}