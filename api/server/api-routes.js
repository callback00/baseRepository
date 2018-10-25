const moment = require('moment')
const redisUtility = require('../src/common/redisUtility')

moment.locale('zh-cn')

module.exports = (express, app, config) => {

  const router = express.Router();

  const setSessionID = (req, res, next) => {
    // 获取请求头中的验证字段，并设定到 req 中
    req.sessionID = redisUtility.getAuthorization(req)

    next()
  };

  // 自定义 url缓存 中间件
  const urlCache = (req, res, next) => {
    if (config.cache) {
      const key = redisUtility.createKey(req.originalUrl, req.body);
      redisUtility.getCache(req.sessionID, key, (success) => {
        // 命中缓存，直接返回缓存内容
        if (success) {
          res.type = 'json';
          res.status(200).json({ success });
          return
        }

        next();
      })
    } else {
      next();
    }
  }


  router.use(setSessionID);
  // 每一条路由都要先执行该 middleware(中间件) 一遍
  router.use(urlCache);

  // 单独处理登出请求，无需权限控制，直接销毁对应的登录内容
  router.use('/logout', (req, res) => {
    res.status(200).end()
    if (config.auth) {
      redisUtility.deleteUser(req.sessionID)
    }
  });

  require('./routes/api-wxApp')(router, app, config);
  require('./routes/api-manage')(router, app, config);

  // 当路由找不到时进行处理
  router.get('*', (req, res) => {
    res.json({
      route: 'Sorry! This page does not exist! 抱歉!该页面不存在!'
    })
  })

  router.post('*', (req, res) => {
    res.json({
      route: 'Sorry! This page does not exist! 抱歉!该页面不存在!'
    })
  })

  /**
   * URL路由需要加前缀
   */
  app.use('/api', router)
}
