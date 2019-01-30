
const config = require('../../config/config')

const jwt = require('jwt-decode')
const redisUtility = require('./redisUtility');

const noticeDetailOperate = require('../operates/manage/notice/noticeDetailOperate')

// 该中间件为正式插件，可使用
exports.socketInit = function (server) {

    if (config.notice_open) {
        const io = require('socket.io')(server);
        io.origins([config.socket_origins]);

        // 中间件，目前仅用于登录校验，非用户不得调用websocket。
        io.use((socket, next) => {

            // token验证登录，并校验token是否错误
            try {
                let sessionID = jwt(socket.handshake.query.token).authorization

                redisUtility.getUser(sessionID, (current) => {
                    if (current) {
                        // 防止redis过去获取不到用户信息
                        const user = { ...current };
                        socket.user = user;
                        socket.sessionID = sessionID;
                        return next();
                    } else {
                        return next(new Error('用户登录已超时，无法接收信息，请重新登录'));
                    }
                });

            } catch (error) {
                return next(new Error('登录已超时，无法接收信息，请重新登录。'));
            }
        });

        // 业务逻辑处理，该插件使用的都是匿名函数，所有的变量都在自己的作用域内，所有连接进来的用户互不影响
        io.on('connection', function (socket) {

            const getData = function () {
                if (socket.user) {
                    noticeDetailOperate.getUserWebNoticeList(socket.user.userId, (error, success) => {
                        if (success.data.length > 0 || success.unReadMsgCount > 0) {
                            socket.emit('newMessage', success);
                            //更新状态，不需要返回处理
                            noticeDetailOperate.updateNoticeListNoticedFlag(success.idArry)
                        }
                    })
                } else {
                    socket.emit('error', '当前登录已失效，如果频繁失效请联系管理员');
                }
            }

            getData()

            const tweets = setInterval(getData, 3000);

            // 刷新页面或者关闭页面时关闭定时器
            socket.on('disconnect', function () {
                clearInterval(tweets);
            });

            socket.on('loginOut', function () {
                clearInterval(tweets);
            });

        });
    }
}

