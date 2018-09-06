//index.js
//获取应用实例
const app = getApp();
const config = require('../../config');

Page({
    data: {
        userInfo: {},
        codeInputDisabled: false,
        setCodeDisabled: false,

        mobile: '',
        code: '',

        time: 60, // 倒计时秒数
        codeDesc: '获取验证码'
    },

    onPhoneChange: function (e) {
        const detail = e.detail;
        this.setData({
            mobile: detail.value,
        });
    },

    onCodeChange: function (e) {
        const detail = e.detail;
        this.setData({
            code: detail.value,
        });
    },

    setCodeHandle: function () {

        if (this.data.mobile.length < 11) {
            wx.showModal({
                title: '错误提示',
                content: '无效的手机号码',
                showCancel: false,
            })
            return;
        }

        if (!this.data.setCodeDisabled) {
            const codeDesc = '重新获取(' + this.data.time + ')';
            this.setData({
                codeInputDisabled: false,
                setCodeDisabled: true,
                codeDesc
            });

            const that = this
            wx.request({
                url: config.sendMsgUrl,
                data: {
                    mobile: this.data.mobile
                },
                header: {
                    'content-type': 'application/json',
                    'Authorization': 'Basic'
                },
                method: 'POST',
                success: function (res) {
                    if (res.data.error) {
                        wx.showModal({
                            title: '错误提示',
                            content: res.data.error,
                            showCancel: false,
                        })
                    }
                },
                fail: function (res) {
                    if (res.data.error) {
                        wx.showModal({
                            title: '错误提示',
                            content: res.data.error,
                            showCancel: false,
                        })
                    }
                }
            })
        } else {
            //开始判断倒计时是否为0
            if (this.data.time == 0) {

                this.setData({
                    time: 60,
                    setCodeDisabled: false,
                    codeDesc: '获取验证码'
                });
                //立即跳出settime函数，不再执行函数后边的步骤
                return;
            } else {
                let time = this.data.time - 1;
                const codeDesc = '重新获取(' + time + ')';
                this.setData({
                    time,
                    codeDesc
                });
            }
        }

        const setCodeHandle = this.setCodeHandle;
        setTimeout(function () { setCodeHandle() }, 1000);
    },

    loginHandle: function (e) {
        const mobile = this.data.mobile;
        const code = this.data.code;

        wx.showLoading({
            title: '正在登录',
            mask: true
        });

        wx.request({
            url: `${config.freUrl}/wxapp/login`, //仅为示例，并非真实的接口地址
            method: 'POST',
            data: { mobile, code },
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function (res) {
                wx.hideLoading();

                if (res.data.error) {
                    wx.showModal({
                        title: '错误提示',
                        content: res.data.error,
                        showCancel: false
                    })
                } else {
                    if (res.data) {
                        wx.setStorageSync('userInfo', JSON.stringify(res.data.success.userInfo));
                        wx.setStorageSync('authorization', res.data.success.authorization);

                        // 返回到进入页面
                        wx.navigateBack({
                            delta: 1
                        });
                    }
                }
            },
            fail: function (res) {
                wx.showModal({
                    title: '错误提示',
                    content: '系统维护中，请稍后再登录',
                    showCancel: false
                })
            },
        })
    },

    backHandle: function (e) {
        wx.switchTab({
            url: '../home/index'
        })
    }
})
