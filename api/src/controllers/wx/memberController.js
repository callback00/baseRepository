const request = require('superagent');
const moment = require('moment')
const redisUtility = require('../../common/redisUtility');
const config = require('../../../config/config');

const logger = require('../../common/logger')

const memberOperate = require('../../operates/wx/memberOperate')
moment.locale('zh-cn')

module.exports = {
    // 获取个人参数的小程序二维码
    getWXQr: (req, res) => {
        const currentUser = req.user;

        redisUtility.getCache(config.wxapp_appid, config.wxapp_secret, (tokenObj) => {
            if (!tokenObj) {
                res.status(200).json({ error: '小程序Token认证未启动。无法生成二维码，如若您在景区，请像工作人员说明。' });
                return
            }

            const access_token = tokenObj.access_token;

            // 生成时间戳，防止盗链
            timestamp = Date.now();

            request
                .post(config.wxacode_url)
                .query({
                    access_token: access_token,
                })
                .send({
                    scene: `${currentUser.mobile}.${timestamp}`,
                    page: 'pages/workAreaAudit/index',
                    width: 300
                })
                .set('Accept', 'application/json')
                .end((wx_err, wx_res) => {
                    if (wx_res.body.errcode) {
                        logger.error(`----- memberController getWXQr error = ${JSON.stringify(wx_res.body)} -----`);
                        res.status(200).json({ error: '获取旅游卡二维码失败，请稍后尝试' });
                        return
                    }
                    const imageUrl = wx_res.body.toString('base64')
                    res.status(200).json({ imageUrl });
                    return;

                })

        });
    },

    getMemberInfoByMobile: (req, res) => {
        let timestamp = req.body.timestamp;
        const mobile = req.body.mobile;

        if (timestamp.length > 0) {
            timestamp = parseInt(timestamp)
        }
        const currentUser = req.user;

        const differ = moment.duration(moment() - moment(timestamp)).as('minutes')
        if (differ > 15) {
            res.status(200).json({ error: '旅客的二维码生成已超过十五钟，请让旅客重新进入系统内"我的"页签后在出示二维码' });
            return;
        }

        memberOperate.getMemberInfoByMobile(mobile, (error, userInfo) => {
            if (error) {
                res.status(200).json({ error });
            } else {
                res.status(200).json({ userInfo });
            }
        })
    }
}
