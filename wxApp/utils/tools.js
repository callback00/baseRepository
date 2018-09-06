const config = require('../config')
const tokenKey = 'authorization'
module.exports = {

    getToken() {
        return wx.getStorageSync(tokenKey)
    },

    // 已验证可调通
    post(url, callback, params = {}, addto = {}) {
        const tokenString = this.getToken();

        wx.request({
            url: `${config.freUrl}${url}`, //仅为示例，并非真实的接口地址
            method: 'POST',
            data: params,
            header: {
                'content-type': 'application/json', // 默认值
                'Authorization': `Basic ${tokenString}`
            },
            success: function (res) {
                if (res.statusCode === 200) {
                    if (res.data.error) {
                        callback(res.data.error);
                    } else {
                        callback(null, res.data);
                    }
                } else if (res.statusCode === 401) {

                    // callback('登录已失效');

                    // 已验证该方法可行
                    setTimeout(() => {
                        wx.navigateTo({
                            url: '../login/index'
                        })
                    }, 1000);
                } else {
                    callback('连接后台服务器失败。');
                }
            },
            fail: function (res) {
                callback('连接后台服务器失败。');
            },
        })
    },

    get(url, callback, params = {}, addto = {}) {
        const tokenString = this.getToken();

        wx.request({
            url: `${config.freUrl}${url}`, //仅为示例，并非真实的接口地址
            method: 'GET',
            data: params,
            header: {
                'content-type': 'application/json', // 默认值
                'Authorization': `Basic ${tokenString}`
            },
            success: function (res) {
                if (res.statusCode === 200) {
                    if (res.data.error) {
                        callback(res.data.error);
                    } else {
                        callback(null, res.data);
                    }
                } else if (res.statusCode === 401) {
                    // callback('登录已失效');
                    // 已验证该方法可行
                    setTimeout(() => {
                        wx.navigateTo({
                            url: '../login/index'
                        })
                    }, 1000);
                } else {
                    callback('连接后台服务器失败。');
                }
            },
            fail: function (res) {
                callback('连接后台服务器失败。');
            },
        })
    }
}