import React from 'react'
import {
    BrowserRouter as Router,
    Route,
    Redirect,
} from 'react-router-dom'

import Login from './login' // 登录页
import auth from '../utils/auth' // 登录验证方法
import BasicLayout from '../layouts/basicLayout'

class Home extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isLogin: auth.isLoggedIn(),
            updateKey: 0, // 注销时如果不销毁组件则无法取到新登录用户的权限
        }

        // 在此加载所有自定义组件，不能将该行代码放在app.js中，放在app.js中热加载不会自动刷新页面
        this.comContext = require.context('..', true, /^\.\/components\/.*\.js$/); // webpack是预加载文件，require 不接受变量路径。
        // console.log(context.keys());//获取正则js目录下文件，转化成数组形势输出
    }

    // 登录方法
    logInCallback(history) {
        this.setState({
            isLogin: true,
            updateKey: this.state.updateKey + 1
        }, () => history.push('/account/setting/base'))
    }

    render() {

        const isLogin = this.state.isLogin;

        return (
            <Router basename="/manage">
                <div>
                    <Route
                        exact
                        path="/login"
                        render={(props) => (
                            <Login logInCallback={this.logInCallback.bind(this)} />
                        )}
                    />
                    {
                        isLogin ? (
                            <BasicLayout key={this.state.updateKey} comContext={this.comContext} />
                        ) : (
                                <Route
                                    path="/"
                                    render={(props) => (
                                        <Redirect to="/login" />
                                    )}
                                />
                            )
                    }
                </div>
            </Router>
        )
    }
}

export default Home