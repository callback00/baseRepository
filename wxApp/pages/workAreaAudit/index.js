const app = getApp()
const tools = require('../../utils/tools')

Page({
    data: {
        mobile: '',
        province: '',
        city: '',

        msg: null,
        aduitDisabled: false,
    },

    onLoad: function (options) {
        // options 中的 scene 需要使用 decodeURIComponent 才能获取到生成二维码时传入的 scene
        const scene = decodeURIComponent(options.scene); // 这是个字符串
        console.log(scene);

        this.handlePower((havePowerFlag) => {

            if (!havePowerFlag) {
                return
            }

            if (scene.length > 0) {
                const paramArry = scene.split('.');
                const mobile = paramArry[0]
                const timestamp = paramArry[1]

                tools.post('/wxapp/member/getMemberInfoByMobile', (error, success) => {

                    if (error) {
                        this.setData({
                            aduitDisabled: true,
                            msg: error
                        })
                    } else {
                        this.setData({
                            mobile: success.userInfo.mobile,
                            city: success.userInfo.city,
                            province: success.userInfo.province,
                            aduitDisabled: false,
                            msg: null
                        })
                    }
                }, { mobile, timestamp })
            } else {
                this.setData({
                    aduitDisabled: true,
                    msg: '旅客的二维码存在异常(出示的二维码可能不是本系统的二维码)，请让旅客重新进入微信小程序。'
                })
            }
        })
    },

    handlePower: function (callback) {
        tools.get('/wxapp/auditer/getAuditerInfo', (error, success) => {
            if (error) {
                this.setData({
                    aduitDisabled: true,
                    msg: error
                });

                return callback(false);
            } else {
                return callback(true);
            }
        })
    },

    handleClick: function (e) {
        tools.post('/wxapp/auditer/handleAudit', (error, success) => {
            if (error) {
                wx.showModal({
                    title: '错误提示',
                    content: error,
                    showCancel: false,
                })
            } else {
                wx.showModal({
                    title: '提示',
                    content: '核销成功',
                    showCancel: false,
                })
                this.setData({
                    aduitDisabled: true
                })
            }
        }, { mobile: this.data.mobile })
    }
})