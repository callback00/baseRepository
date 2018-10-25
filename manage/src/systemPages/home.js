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
                            <BasicLayout key={this.state.updateKey} />
                        ) : (
                                <Route
                                    path="/"
                                    exact
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