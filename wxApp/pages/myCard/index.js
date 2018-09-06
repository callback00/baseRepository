//index.js
//获取应用实例
const app = getApp()
import QRCode from '../../utils/qrCode' // 这个可以生成非小程序本身的二维码
const tools = require('../../utils/tools')

Page({
    data: {
        mobile: '',
        province: '',
        city: '',
        imageUrl: ''
    },

    // 小程序的tabar切换页面时不会再次出发onLoad,所以只能用onShow
    onShow: function (options) {
        const userInfoStr = wx.getStorageSync('userInfo')

        if (userInfoStr) {
            const userInfo = JSON.parse(userInfoStr)

            this.setData({
                mobile: userInfo.mobile,
                province: userInfo.province,
                city: userInfo.city
            })

            tools.post('/wxapp/member/QRInfo', (error, success) => {

                if (error) {
                    wx.showModal({
                        title: '错误提示',
                        content: error,
                        showCancel: false
                    })
                } else if (success && success.error) {
                    wx.showModal({
                        title: '错误提示',
                        content: success.error,
                        showCancel: false
                    })
                } else {
                    const imageUrl = success.imageUrl
                    this.setData({
                        imageUrl
                    })
                }
            })

            // 生成非小程序本身的二维码，建议保留该部分代码，以后可能用到
            // const qrcode = new QRCode('canvas', {
            //     text: 'http://www.w3cschool.cc/',
            //     width: 150,
            //     height: 150,
            //     colorDark: '#000000',
            //     colorLight: '#ffffff',
            //     correctLevel: QRCode.correctLevel.H
            // });
        } else {
            wx.navigateTo({
                url: '../login/index'
            })
        }
    }
})
