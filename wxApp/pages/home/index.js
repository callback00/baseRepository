//index.js
//获取应用实例
const app = getApp();
const tools = require('../../utils/tools')

Page({

    data: {

        loginBtnShow: true,

        imgUrls: [
            '../../images/swiper/2.jpg',
            '../../images/swiper/4.jpg',
        ],

        scenicData: [
            {
                img: '../../images/scenic/4.jpg',
                name: '银杉公园',
                openTime: '8:30-16:00',
                price: 45
            },
            {
                img: '../../images/scenic/1.jpg',
                name: '莲花山景区',
                openTime: '8:30-16:00',
                price: 0
            },
            {
                img: '../../images/scenic/2.jpg',
                name: '圣堂湖景区',
                openTime: '8:30-16:00',
                price: 0
            },
            {
                img: '../../images/scenic/3.jpeg',
                name: '圣堂山景区',
                openTime: '8:30-16:00',
                price: 65
            }
        ],
    },

    onShow: function (e) {
        const userInfoStr = wx.getStorageSync('userInfo')

        if (userInfoStr) {
            this.setData({
                loginBtnShow: false
            })
        }
    },

    loginHandle: function (e) {
        wx.navigateTo({
            url: '../login/index'
        })
    },
})
