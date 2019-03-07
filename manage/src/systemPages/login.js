import React, { Component } from 'react'
import { message, TreeSelect, Input, Icon } from 'antd'
import { withRouter } from 'react-router-dom'

import auth from '../utils/auth' // 登录验证方法
import tools from '../utils/tools'

const iBase = {

    Id: function (name) {
        return document.getElementById(name);
    },

    //设置元素透明度,透明度值按IE规则计,即0~100
    SetOpacity: function (ev, v) {
        ev.filters ? ev.style.filter = 'alpha(opacity=' + v + ')' : ev.style.opacity = v / 100;
    }

}

class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            id: '',
            password: '',
            companyId: '1',
            recoveryShow: '',

            toggle: 'closed'
        }

        this.sh = null

        this.idChange = this.idChange.bind(this)
        this.passwordChange = this.passwordChange.bind(this)
        this.keyDownHandle = this.keyDownHandle.bind(this)
        this.companyChange = this.companyChange.bind(this)
    }

    componentDidMount() {
        tools.get('/login/getCompanyTree', (json) => {
            if (json.success) {
                const companyId = window.localStorage.getItem('companyId') ? window.localStorage.getItem('companyId') : '1'
                this.setState({ companys: json.success, companyId }, () => {
                    // 实现淡入淡出切换效果
                    const one = document.getElementById("one")
                    const two = document.getElementById("two")
                    const three = document.getElementById("three")
                    const four = document.getElementById("four")

                    const arry = [one, two, three, four]
                    let activeIndex = 0
                    const that = this

                    this.sh = setInterval(function () {
                        that.fadeOut(arry[activeIndex], 40, 0)

                        if (activeIndex < arry.length - 1) {
                            activeIndex = activeIndex + 1
                            setTimeout(() => {
                                that.fadeIn(arry[activeIndex], 40, 0)
                            }, 100)
                        } else {
                            activeIndex = 0
                            setTimeout(() => {
                                that.fadeIn(arry[activeIndex], 40, 0)
                            }, 100)
                        }

                    }, 3800);
                });
            } else {
                message.error('无法获取组件结构，请联系管理员')
            }
        })
    }


    fadeIn(elem, speed, opacity) {
        /*
         * 参数说明
         * elem==>需要淡入的元素
         * speed==>淡入速度,正整数(可选)
         * opacity==>淡入到指定的透明度,0~100(可选)
         */
        speed = speed || 20;
        opacity = opacity || 100;
        //显示元素,并将元素值为0透明度(不可见)
        elem.style.display = 'block';
        iBase.SetOpacity(elem, 0);
        //初始化透明度变化值为0
        var val = 0;
        //循环将透明值以5递增,即淡入效果
        const opacityAdd = function () {
            iBase.SetOpacity(elem, val);
            val += 5;
            if (val <= opacity) {
                setTimeout(opacityAdd, speed)
            }
        };

        opacityAdd()
    }

    //淡出效果(含淡出到指定透明度)
    fadeOut(elem, speed, opacity) {
        /*
         * 参数说明
         * elem==>需要淡入的元素
         * speed==>淡入速度,正整数(可选)
         * opacity==>淡入到指定的透明度,0~100(可选)
         */
        speed = speed || 20;
        opacity = opacity || 0;
        //初始化透明度变化值为0
        var val = 100;

        //循环将透明值以5递减,即淡出效果
        const opacityReduce = function () {
            iBase.SetOpacity(elem, val);
            val -= 5;
            if (val >= opacity) {
                setTimeout(opacityReduce, speed);
            } else if (val < 0) {
                //元素透明度为0后隐藏元素
                elem.style.display = 'none';
            }
        };

        opacityReduce();
    }

    idChange(event) {
        this.setState({
            id: event.target.value
        })
    }

    passwordChange(event) {
        this.setState({
            password: event.target.value
        })
    }

    companyChange(value, label, extra) {
        // 这个控件可以取消选择，所以要判断value值是否存在
        if (value) {
            window.localStorage.setItem('companyId', `${value}`)
            this.setState({
                companyId: `${value}`
            })
        }
    }

    keyDownHandle(event) {
        if (event.keyCode === 13) {
            this.clickHandle()
        }
    }

    clickHandle() {
        const { id, password, companyId } = this.state

        if (id === '' || password === '') {
            return
        }

        auth.login(id, password, companyId, (json) => {
            if (json.success) {
                if (this.sh) {
                    clearInterval(this.sh)
                }
                this.props.logInCallback(this.props.history);
            } else {
                message.error(json.error)
            }
        })

    }

    forgotClick() {
        let recoveryShow = this.state.recoveryShow;
        let toggle = this.state.toggle

        if (recoveryShow === 'open') {
            recoveryShow = 'closed'
        } else {
            recoveryShow = 'open'
        }

        if (toggle === 'open') {
            toggle = 'closed'
        } else {
            toggle = 'open'
        }

        this.setState({
            recoveryShow,
            toggle
        })
    }

    render() {

        return (
            <div className="login">
                <div className="login-wrap">

                    {/* 忘记密码弹出框关闭按钮 */}
                    <div id="toggle-wrap">
                        <div id="toggle-terms" className={this.state.toggle} onClick={this.forgotClick.bind(this)}>
                            <div id="cross">
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    </div>

                    {/* 忘记密码页面 */}
                    <div className={`recovery ${this.state.recoveryShow}`}>
                        <h2>密码重置流程</h2>
                        <p>请将你的 <strong>账号</strong> 以及 <strong>联系方式</strong> 告知管理员， 耐心等待 <strong>10分钟</strong> 在重新登录即可</p>
                        <p>管理员在楼道最里头的办公室</p>

                    </div>

                    {/* 书本左页面 */}
                    <div className="login-content">

                        <div className="login-logo">
                            <a href="#"><img src="/manage/images/login/logo.png" alt="" /></a>
                        </div>

                        <div id="slideshow">
                            <div id="one" className="one">
                                <h2><span>Welcome</span></h2>
                                <p>欢迎使用乐亿家信息管理系统，祝你开心每一天！</p>
                            </div>
                            <div id="two" className="two" style={{ display: 'none' }}>
                                <h2><span>EVENTS</span></h2>
                                <p>Sign up to attend any of hundreds of events nationwide</p>
                            </div>
                            <div id="three" className="three" style={{ display: 'none' }}>
                                <h2><span>GROUPS</span></h2>
                                <p>Create your own groups and connect with others that share your interests</p>
                            </div>
                            <div id="four" className="four" style={{ display: 'none' }}>
                                <h2><span>SHARING</span></h2>
                                <p>Share your works and knowledge with the community on the public showcase section</p>
                            </div>
                        </div>
                    </div>

                    {/* 书本右页面 */}
                    <div className="login-user">
                        <div className="form-wrap">
                            <div className="login-form">
                                <TreeSelect
                                    size="large"
                                    suffixIcon={<Icon type="user" style={{ fontSize: '20px' }} />}
                                    style={{ flex: '1 1 auto', display: 'block', marginBottom: '0.8em' }}
                                    value={this.state.companyId}
                                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                    treeData={this.state.companys ? this.state.companys : []}
                                    placeholder="Please select"
                                    treeDefaultExpandAll
                                    onChange={this.companyChange}
                                />
                                <input type="text" onChange={this.idChange} onKeyDown={this.keyDownHandle} className="input" id="user_login" autoComplete="off" placeholder="用户名" />
                                <input type="password" onChange={this.passwordChange} onKeyDown={this.keyDownHandle} className="input" id="user_pass" autoComplete="off" placeholder="密码" />

                                <div className="login-option">
                                    <button className="login-button" onClick={this.clickHandle.bind(this)} >登录</button>
                                    <span>
                                        <i className="fa fa-arrow-left" aria-hidden="true"></i>
                                        <a className="forgot" onClick={this.forgotClick.bind(this)}>
                                            忘记密码?
                                    </a>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const LoginWithRouter = withRouter(Login)
export default LoginWithRouter
