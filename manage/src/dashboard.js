import React from 'react'
import {
  HashRouter as Router,
  Route,
  Link,
  Redirect,
  Switch
} from 'react-router-dom'
import { LocaleProvider, message } from 'antd'
import zhCN from 'antd/lib/locale-provider/zh_CN'

// base
import Useradd from './components/user/userAdd'
import Userinfo from './components/user/userInfo'
import Userlist from './components/user/userList'

import Nav from './components/base/nav' // 导航组件
import Login from './components/base/login' // 登录页
import Repassword from './components/base/rePassword' // 重置密码
import auth from './utils/auth' // 登录验证方法

// business
import MemberReport from './components/baseReport/memberReport'
import AuditLogReport from './components/baseReport/auditLogReport'
import AuditerHome from './components/auditerManage/auditerHome'
import ScenicHome from './components/wxHomeInfoManage/scenicHome'

class Dashboard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isLogin: false
    }
  }

  componentWillMount() {
    const isLogin = auth.isLoggedIn()
    this.setState({
      isLogin
    })
  }

  // 登录方法
  logIn(history, id, password) {
    auth.login(id, password, (res) => {
      if (res.success) {
        this.setState({
          isLogin: true
        }, () => history.push('/'))
      } else {
        message.error(res.error)
      }
    })
  }

  logOut(history) {
    auth.logout()
    this.setState({
      isLogin: false
    }, () => history.push('/'))
  }

  rootPath() {

    //获取权限
    const list = auth.getPath()
    if (!list) {
      return '/login'
    }

    return '/dashboard/baseReport/memberReport'
  }

  render() {
    const { isLogin } = this.state
    const rootUrl = this.rootPath()

    return (
      <LocaleProvider locale={zhCN}>
        <Router basename="/manage">
          <div>
            <Route
              exact
              path="/"
              render={() => (
                isLogin ? (
                  <Redirect to={rootUrl} />
                ) : (
                    <Redirect to="/login" />
                  )
              )} />

            <Route
              exact
              path="/login"
              render={({ history }) => (
                isLogin ? (
                  <Redirect to={rootUrl} />
                ) : (
                    <Login login={this.logIn.bind(this, history)} />
                  )
              )}
            />

            <Route
              path="/dashboard"
              render={({ history }) => (
                isLogin ? (
                  <div className="wrap">
                    {/* 左侧链接导航 */}
                    <div className="nav">
                      <div className="logo" style={{ textAlign: 'center' }}>
                        {/* <img src="/manage/images/logo_03.png" style={{ width: '100%' }} alt="logo" /> */}
                      </div>
                      <Nav />
                    </div>

                    {/* 右侧内容组件 */}
                    <div className="content">
                      <div className="header">
                        <span style={{ fontSize: 16, marginRight: 15 }}><i>{auth.getName()}</i></span>
                        <Link className="repassword" to={{ pathname: '/dashboard/repassword' }}>修改密码</Link>
                        <span onClick={this.logOut.bind(this, history)} className="logout">登出</span>
                      </div>
                      <div className="component">
                        <Route path="/dashboard/repassword" render={() => <Repassword logout={this.logOut.bind(this, history)} history={history} />} />
                        <Route path="/dashboard/user/add" component={Useradd} />
                        <Route path="/dashboard/user/info/:id" component={Userinfo} />
                        <Route path="/dashboard/user/list" component={Userlist} />

                        <Route path="/dashboard/baseReport/memberReport" component={MemberReport} />
                        <Route path="/dashboard/baseReport/auditLogReport" component={AuditLogReport} />

                        <Route path="/dashboard/auditerHome" component={AuditerHome} />
                        <Route path="/dashboard/scenicHome" component={ScenicHome} />
                      </div>
                      <div className="footer">
                        &copy; 2018 管理信息系统
                      </div>
                    </div>
                  </div>
                ) : (
                    <Redirect to="/login" />
                  )
              )} />
          </div>
        </Router>
      </LocaleProvider>
    )
  }
}


export default Dashboard
