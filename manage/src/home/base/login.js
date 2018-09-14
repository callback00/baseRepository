import React, { Component } from 'react'
// import { Input, Icon, Button } from 'antd'

class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      id: '',
      password: ''
    }

    this.idChange = this.idChange.bind(this)
    this.passwordChange = this.passwordChange.bind(this)
    this.keyDownHandle = this.keyDownHandle.bind(this)
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

  keyDownHandle(event) {
    if (event.keyCode === 13) {
      this.clickHandle()
    }
  }

  clickHandle() {
    const { id, password } = this.state

    if (id === '' || password === '') {
      return
    }

    this.props.login(id, password)
  }

  render() {

    return (
      <div className="login_main">
        <div className="login_box">
          <div className="front">
            <div className="title">欢迎使用</div>
            <div className="login_input">
              <div className="login_phone">
                <div className="text">用户名</div>
                <input value={this.state.id} className="value" placeholder=" 请输入用户名" onChange={this.idChange} onKeyDown={this.keyDownHandle} />
              </div>
              <div className="login_code">
                <div className="text">密码</div>
                <input value={this.state.password} type="password" className="value" placeholder=" 请输入密码" onChange={this.passwordChange} onKeyDown={this.keyDownHandle} />
              </div>
            </div>
            <div className="btn_ok btn_ok_enable" onClick={this.clickHandle.bind(this)}>登入</div>
          </div>
        </div>
      </div>
    )
  }
}

export default Login
