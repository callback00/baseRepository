// const freUrl = "http://192.168.0.110:8081/api";
const freUrl = "https://mxlot.com/api";
const config = {
    freUrl,
    //发送短信验证码
    sendMsgUrl: `${freUrl}/wxapp/login/send`,
    //验证码验证Url
    viliCodeUrl: `${freUrl}/wxapp/login/vilidate`,
    //注册用户Url
    registUrl: `${freUrl}/wxapp/regist`,
    //验证微信手机号码Url
    decodeUrl: `${freUrl}/wxapp/login/decode`
};

module.exports = config