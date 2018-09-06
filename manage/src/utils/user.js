/**************************************
 * Created by lemon on 2016年01月05日
 * Description: 邕城通系统用户管理公用方法
 **************************************/
import tools from './tools'

export default {
  createUser(data, callback) {
    data.password = tools.md5password(data.password)
    tools.put('/user/create', callback, data)
  },

  updateUser(data, callback) {
    if (data.password && data.password.length > 0) {
      data.password = tools.md5password(data.password)
    }

    tools.put('/user/update', callback, data)
  },

  deleteUser(userid, callback) {
    tools.del('/user/delete', callback, {
      userid
    })
  },

  getUserInfo(userid, callback) {
    tools.post('/user/info', callback, {
      userid
    })
  },

  getUserList(callback, pageindex = 0) {
    tools.post('/user/list', callback, null, {
      pageindex
    })
  },

  getRuleList(callback) {
    tools.post('/user/rule', callback)
  }
}
