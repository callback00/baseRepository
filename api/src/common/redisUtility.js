const Redis = require('ioredis')
const jwt = require('jwt-decode')
// const { decode, verify } = require('jsonwebtoken')
const config = require('../../config/config')

const redis = config.auth ? new Redis({
  port: config.redis_port,
  host: config.redis_host,
  connectTimeout: 400,
  retryStrategy: (times) => {
    const delay = Math.min(times * 2, 1000)
    return delay
  },
  reconnectOnError: (error) => {
    console.log('redis-error: ', error)
    return true
    /*
    var targetError = 'READONLY'
    if (err.message.slice(0, targetError.length) === targetError) {
      // Only reconnect when the error starts with "READONLY"
      return true // or `return 1`
    }
    */
  }
}) : null

module.exports = {

  getRedis() {
    return redis
  },


  getAuthorization(req) {
    if (!req || !req.headers || !req.headers.authorization) {
      return false
    }

    const authorization = req.headers.authorization
    if (authorization.length > 6 && authorization.startsWith('Basic ')) {
      const tokenString = authorization.substr(6)
      try {
        const token = jwt(tokenString)
        // const token2 = decode(tokenString)
        // const token3 = verify(tokenString, config.secret)
        // console.log(token, token2, token3)
        const now = Date.now() / 1000
        if (token.iat < now && token.exp > now) {
          return token.authorization
        }
      } catch (error) {
        // console.log('jwt-decode error: ', error)
        return false
      }
    }

    return false
  },


  createKey(path, params = {}) {
    const array = []
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        array.push(`${key}=${params[key]}`)
      }
    }

    array.sort()

    return `${path}?${array.join('&')}`
  },


  setUser(sessionID, value, maxAge = config.redis_maxAge) {
    if (!config.auth) {
      return false
    }

    const data = JSON.stringify(value)
    redis.set(sessionID, data, 'EX', maxAge)
  },


  getUser(sessionID, callback) {
    if (!config.auth) {
      return callback(undefined)
    }

    return redis.get(sessionID, (error, data) => {
      if (data) {
        const current = JSON.parse(data)
        return callback(current)
      }

      return callback(undefined)
    })
  },


  getUserSync(sessionID) {
    if (!config.auth) {
      return undefined
    }

    return redis.get(sessionID)
  },


  deleteUser(sessionID) {
    if (!config.auth) {
      return false
    }

    redis.pipeline().del(sessionID).exec()
    this.reset(sessionID)
  },


  createCache(sessionID, key) {
    return `${sessionID}@${key}`
  },


  setCache(sessionID, key, value, maxAge = config.cache_maxAge) {
    if (!config.auth) {
      return false
    }

    const cache = this.createCache(sessionID, key)
    const data = JSON.stringify(value)
    redis.set(cache, data, 'EX', maxAge)
  },


  getCache(sessionID, key, callback) {
    if (!config.auth) {
      return callback(undefined)
    }

    const cache = this.createCache(sessionID, key)
    return redis.get(cache, (error, data) => {
      if (data) {
        const current = JSON.parse(data)
        return callback(current)
      }

      return callback(undefined)
    })
  },


  getCacheSync(sessionID, key) {
    if (!config.auth) {
      return undefined
    }

    const cache = this.createCache(sessionID, key)
    return redis.get(cache)
  },


  reset(sessionID) {
    if (!config.auth) {
      return false
    }

    redis.pipeline().keys(`${sessionID}@*`).exec((error, results) => {
      if (results.length === 1 && results[0].length === 2) {
        const keys = results[0][1]
        const pipeline = redis.pipeline()

        keys.forEach((key) => {
          pipeline.del(key)
        })

        pipeline.exec()
      }
    })
  },

}
