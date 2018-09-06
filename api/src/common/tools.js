const moment = require('moment')

moment.locale('zh-cn')

const idCardPattern = /^\d{17}(\d|x)$/i

const idCardCitys = {
  11: '北京', 12: '天津', 13: '河北', 14: '山西', 15: '内蒙古',
  21: '辽宁', 22: '吉林', 23: '黑龙江',
  31: '上海', 32: '江苏', 33: '浙江', 34: '安徽', 35: '福建', 36: '江西', 37: '山东',
  41: '河南', 42: '湖北 ', 43: '湖南', 44: '广东', 45: '广西', 46: '海南',
  50: '重庆', 51: '四川', 52: '贵州', 53: '云南', 54: '西藏 ',
  61: '陕西', 62: '甘肃', 63: '青海', 64: '宁夏', 65: '新疆',
  71: '台湾',
  81: '香港', 82: '澳门',
  91: '国外'
}

const idCardWeights = [
  7, 9, 10, 5, 8,
  4, 2, 1, 6, 3,
  7, 9, 10, 5, 8,
  4, 2
]

const idCardDatas = [
  '1', '0', 'X', '9', '8',
  '7', '6', '5', '4', '3',
  '2'
]

const adultYear = 18

const mobliePattern = /^(1[3456789]\d{9})|(0\d{2,3}-?\d{7,8})$/


module.exports = {
  idCardValidate(string) {
    if (typeof string !== 'string') {
      return { error: '非法身份证字符串' }
    } else if (string.length !== 18) {
      return { error: '非法身份证长度' }
    }

    if (!idCardPattern.test(string)) {
      return { error: '非法身份证' }
    }

    const cc = string.substr(0, 2)
    const city = idCardCitys[cc]
    if (!city) {
      return { error: '非法身份证地区' }
    }

    const yy = string.substr(6, 4)
    const mm = string.substr(10, 2)
    const dd = string.substr(12, 2)
    const bb = moment(`${yy}-${mm}-${dd}`)
    if (!bb || bb.isAfter(moment())) {
      return { error: '非法身份证生日' }
    }

    const array = string.split('', 17)
    const count = array.reduce((last, current, index) => {
      return last + current * idCardWeights[index]
    }, 0)

    const ii = count % 11
    const vv = idCardDatas[ii]
    const last = string.substr(17).toUpperCase()
    if (vv !== last) {
      return { error: '非法身份证' }
    }

    const birthday = bb.format('YYYY-MM-DD')
    const gg = string.substr(16, 1)
    const gender = gg % 2 ? '男' : '女'

    const adult = bb.add(adultYear, 'years').isBefore(moment())

    const success = {
      birthday,
      city,
      gender,
      adult,
    }

    // 未成年 adult 返回 false
    // console.log(string, success)

    return { success }
  },

  checkMoblie(string) {
    return !mobliePattern.test(string)
  },

}
