import React, { Component } from 'react'
import { message, TreeSelect, Input, Icon } from 'antd'
import { withRouter } from 'react-router-dom'

import auth from '../utils/auth' // 登录验证方法
import tools from '../utils/tools'

class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            id: '',
            password: '',
            companyId: '1',
        }

        this.idChange = this.idChange.bind(this)
        this.passwordChange = this.passwordChange.bind(this)
        this.keyDownHandle = this.keyDownHandle.bind(this)
        this.companyChange = this.companyChange.bind(this)
    }

    componentDidMount() {
        tools.get('/login/getCompanyTree', (json) => {
            if (json.success) {
                this.setState({ companys: json.success });
            } else {
                message.error('无法获取组件结构，请联系管理员')
            }
        })
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
                this.props.logInCallback(this.props.history);
            } else {
                message.error(json.error)
            }
        })

    }

    render() {

        return (
            <div className="login_main">
                <div className="login_box">
                    <div className="front">
                        <div className="title">欢迎使用</div>
                        <div className="login_input">
                            <div style={{ display: 'flex', alignItems: 'baseline', borderRadius: '4px' }} >
                                <div style={{ height: '40px', lineHeight: '39px', background: '#fafafa', borderRadius: '4px 0 0 4px', borderLeft: '1px solid #d9d9d9', borderTop: '1px solid #d9d9d9', borderBottom: '1px solid #d9d9d9' }}>
                                    <span style={{ padding: '0 11px' }} ><Icon type="home" style={{ fontSize: '20px' }} /></span>
                                </div>
                                <TreeSelect
                                    size="large"
                                    suffixIcon={<Icon type="user" style={{ fontSize: '20px' }} />}
                                    style={{ flex: '1 1 auto' }}
                                    value={this.state.companyId}
                                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                    treeData={this.state.companys ? this.state.companys : []}
                                    placeholder="Please select"
                                    treeDefaultExpandAll
                                    onChange={this.companyChange}
                                />
                            </div>
                            <div style={{ paddingTop: '15px' }}>
                                <Input onChange={this.idChange} onKeyDown={this.keyDownHandle} size="large" addonBefore={<Icon type="user" style={{ fontSize: '20px' }} />} placeholder="用户名" />
                            </div>
                            <div style={{ paddingTop: '15px' }}>
                                <Input onChange={this.passwordChange} onKeyDown={this.keyDownHandle} size="large" type="password" addonBefore={<Icon type="lock" style={{ fontSize: '20px' }} />} placeholder="密码" />
                            </div>
                        </div>
                        <div className="btn_ok btn_ok_enable" onClick={this.clickHandle.bind(this)}>登入</div>
                    </div>
                </div>
            </div>
        )
    }
}

const LoginWithRouter = withRouter(Login)
export default LoginWithRouter
