
const letter = [
  'a', 'b', 'c', 'd', 'e', 'f', 'g',
  'A', 'B', 'C', 'D', 'E', 'F', 'G',
  'H', 'I', 'J', 'K', 'L', 'M', 'N',
  'O', 'P', 'Q', 'R', 'S', 'T',
  'U', 'V', 'W', 'X', 'Y', 'Z',
  '1', '2', '3', '4', '5', '6', '7', '8', '9'
]

const number = [
  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
]

module.exports = {
  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
  },

  getSeed(length = 4, config = false) {
    let __temp = ''
    const seed = config ? letter : number

    while (__temp.length < length) {
      __temp = `${__temp}${seed[this.getRandomInt(0, seed.length - 1)]}`
    }

    return __temp
  }
}
