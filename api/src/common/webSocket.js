
const config = require('../../config/config')

const jwt = require('jwt-decode')
const redisUtility = require('./redisUtility');

const noticeDetailOperate = require('../operates/manage/notice/noticeDetailOperate')

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

        // 此处处理逻辑有一个要点，如果前端页面token过期了，仍然需要发送信息，不能因为token过期而停止发送信息
        // 案例一：如果该信息是餐厅的菜单提示，页面是一直开着的，如果因为token过期收不到消息，厨房就要爆炸了...
        // 获取相应的用户消息，只需知道userId即可，所以在中间件校验里只需记录当前登录用户即可
        io.on('connection', function (socket) {
            const tweets = setInterval(function () {
                if (socket.user) {
                    noticeDetailOperate.getUserWebNoticeList(socket.user.userId, (error, success) => {
                        if (success.data.length > 0) {
                            socket.volatile.emit('newMessage', success);
                        }
                    })
                } else {
                    socket.volatile.emit('error', '当前登录已失效，如果频繁失效请联系管理员');
                }
            }, 5000);

            //刷新页面或者关闭页面时关闭定时器
            socket.on('disconnect', function () {
                console.log('当前的socket', io.sockets)
                clearInterval(tweets);
            });

            socket.on('loginOut', function () {
                console.log('loginOut', io.sockets)
                clearInterval(tweets);
            });

        });
    }
}

