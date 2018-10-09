import React from 'react';
import { Layout } from 'antd';

import {
    withRouter,
    Route,
    Redirect,
    Switch
} from 'react-router-dom'

import SiderMenu from './parts/siderMenu'
import Header from './parts/header'
import BusinessContent from './parts/businessContent'
import Footer from './parts/footer'

import tools from '../utils/tools'
import systemRoute from '../../config/systemRoute.config'

import NoPageComponent from '../systemPages/exception/404'

const { Sider } = Layout;

class BasicLayout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            menuTreeList: [],
            menuPermissionList: [],
            getPermissionFlag: false
        }
    }

    componentWillMount() {
        this.getUserMenu();
    }

    // 权限组件获取
    getUserMenu() {
        tools.post('/menuPermission/getCurrentMenuPermission', (json) => {
            if (json.success) {
                const menuTreeList = json.success.menuTreeList;
                let menuPermissionList = json.success.menuPermissionList;

                // webpack是预加载文件，require 不接受变量路径。
                // 利用require.context将components文件下的所有js引入进来
                var context = require.context('..', true, /^\.\/components\/.*\.js$/);//参数3正则介绍：扫描../components/目录下所有以.js结尾的文件
                // console.log(context.keys());//获取正则js目录下文件，转化成数组形势输出

                // 注意此时context的路径已经在src下，输出的文件名 ./components/xx/xx.js 其中xx与components下的文件结构有关
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

    // 渲染组件内容
    renderContentRoute() {
        let route = this.state.menuPermissionList.map((item) => {
            return (
                <Route key={item.id} path={item.menuLink} component={item.component} />
            )
        })

        // 系统默认带有的路由
        const defaultRoute = systemRoute.map(item => {
            return (
                <Route key={item.key} path={item.menuLink} component={item.component} />
            )
        })

        route = [...route, ...defaultRoute]

        // 处理空路径跳转
        route.push(
            <Route
                exact
                key='empty'
                path="/"
                render={(props) => (
                    <Redirect to="/account/setting/base" />
                )}
            />
        )

        // 处理页面不存在
        route.push(
            <Route
                key='404'
                render={(props) => (
                    <NoPageComponent />
                )}
            />
        )
        return route
    }

    render() {

        return (
            <React.Fragment>
                {
                    this.state.getPermissionFlag ?
                        (<div className="wrap">

                            <div className="layout-left">
                                <Sider>
                                    <SiderMenu menuTreeList={this.state.menuTreeList} />
                                </Sider>
                            </div>

                            <div className="layout-right">
                                <Header {...this.props} />

                                <BusinessContent>
                                    <Switch>
                                        {
                                            this.renderContentRoute()
                                        }
                                    </Switch>
                                </BusinessContent>

                                <Footer />
                            </div>
                        </div>) : null
                }
            </React.Fragment>
        );
    }
}


// export default BasicLayout
const BasicLayoutWithRouter = withRouter(BasicLayout)

export default BasicLayoutWithRouter