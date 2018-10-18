const http = require('http')
const express = require('express')

const config = require('./config/config')


/**
 * 创建服务器
 */
const app = module.exports = express()

const env = process.env.NODE_ENV || 'development'
const apiport = process.env.PORT || config.apiport || 3000

app.set('env', env)
app.set('port', apiport)

require('./server/api-express')(app, env, config)

require('./server/api-routes')(express, app, config)

// 127.0.0.1限制本机访问，用于生产环境仅允许域名访问nginx跳转
const server = http.createServer(app);

const io = require('socket.io')(server);
io.on('connection', function (socket) {

    const tweets = setInterval(function () {
        socket.volatile.emit('newMessage', 'dear');
    }, 5000);

    socket.on('disconnect', function () {
        clearInterval(tweets);
    });

});

server.listen(apiport, () => {
    console.info(`==> 🌐  ${config.name} Server started on port ${apiport}, env=${env}`)
})
