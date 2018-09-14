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

import Nav from './nav' // 导航组件
import Login from './base/login' // 登录页
import Repassword from './base/rePassword' // 重置密码
import auth from '../utils/auth' // 登录验证方法

import tools from '../utils/tools'

class Dashboard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isLogin: false,

      menuTreeList: [],
      menuPermissionList: [],

      getPermissionFlag: false // 避免死循环用的
    }
  }

  componentWillMount() {
    const isLogin = auth.isLoggedIn()
    this.setState({
      isLogin
    });
  }

  getUserMenu() {
    tools.post('/menuPermission/getCurrentMenuPermission', (json) => {
      if (json.success) {
        const menuTreeList = json.success.menuTreeList;
        let menuPermissionList = json.success.menuPermissionList;

        // webpack是预加载文件，require 不接受变量路径。
        // 利用require.context将components文件下的所有js引入进来
        var context = require.context('..', true, /^\.\/components\/.*\.js$/);//参数3正则介绍：扫描../components/目录下所有以.js结尾的文件
        console.log(context.keys());//获取正则js目录下文件，转化成数组形势输出

        // 注意此时context的路径已经在src下，输出的文件名 ./components/xx/xx.js 其中xx与components下的文件结构有关
        const filename = "./components/baseReport/memberReport.js";
        console.log(context(filename));

        menuPermissionList.forEach(menu => {
          const filename = './components' + menu.comPath;
          menu.component = context(filename).default
        });

        this.setState({
          menuTreeList,
          menuPermissionList,
          getPermissionFlag: true
        });
      } else {
        message.error(json.error);
      }
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
    // 这里需要在改进下，应该取第一个node，然后递归取第一个子节点，因为api获取到的menuPermissionList排序是没有用的
    const defaultLink = this.state.menuPermissionList.length > 0 ? this.state.menuPermissionList[0].menuLink : '';

    return defaultLink;
  }

  render() {

    const { isLogin } = this.state;

    if (!isLogin) {
      return (
        <LocaleProvider locale={zhCN}>
          <Router basename="/manage">
            <div>
              <Route
                exact
                path="/"
                render={() => (
                  <Redirect to="/login" />
                )} />

              <Route
                exact
                path="/login"
                render={({ history }) => (
                  <Login login={this.logIn.bind(this, history)} />
                )}
              />
            </div>
          </Router>
        </LocaleProvider>
      )
    } else {
      if (!this.state.getPermissionFlag) {
        this.getUserMenu();
      }
    }

    // 数据未加载出来时直接返回
    if (this.state.menuPermissionList.length < 1) {
      return (
        <div>
        </div>
      )
    }

    const rootUrl = this.rootPath();

    return (
      <LocaleProvider locale={zhCN}>
        <Router basename="/manage">
          <div>
            <Route
              exact
              path="/"
              render={() => (
                <Redirect to={rootUrl} />
              )} />

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
                      <Nav menuTreeList={this.state.menuTreeList} />
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
                        {
                          this.state.menuPermissionList.map((item) => {
                            return (
                              <Route key={item.id} path={item.menuLink} component={item.component} />
                            )
                          })
                        }
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
