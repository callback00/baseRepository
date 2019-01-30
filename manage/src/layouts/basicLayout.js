import React from 'react';
import { Layout, message } from 'antd';
import systemMenu from '../../config/systemMenu.config'

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
            getPermissionFlag: false, //未调用api前界面不显示
        }

        this.siderKey = 0;
        this.rootSubmenuKeys = []
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

                const context = this.props.comContext
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

    // 根据路径选择菜单，同时记录父节点路径
    getSelectedMenu(menuTreeList, pathname, parent = null) {
        for (const item of menuTreeList) {
            if (item.children && item.children.length > 0) {
                if (item.menuId) {
                    this.rootSubmenuKeys.push(item.menuId)
                } else {
                    this.rootSubmenuKeys.push(item.key)
                }
                const selectItem = this.getSelectedMenu(item.children, pathname, item);
                if (selectItem) {
                    return selectItem
                }
            } else {
                if (item.menuLink === pathname) {
                    return item
                }
            }
        };
    }

    // 渲染组件内容
    renderContentRoute() {
        let route = this.state.menuPermissionList.map((item) => {
            return (
                <Route key={`base-${item.menuId}`} path={item.menuLink} component={item.component} />
            )
        })

        // 系统默认带有的路由
        const defaultRoute = systemRoute.map(item => {
            return (
                <Route key={`system-${item.key}`} path={item.menuLink} component={item.component} />
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
        if (this.state.getPermissionFlag) {
            // 注意，在这里是无法通过this.props.match获取到参数的，要获取/:xxx的参数只能在路由对应的组件内才能获取到。
            let { pathname } = this.props.location;
            const menuTreeList = this.state.menuTreeList;
            const list = [...menuTreeList, ...systemMenu]

            // 特殊处理个人中心的路径查询
            if (pathname === '/account/setting/security') {
                pathname = '/account/setting/base'
            }

            const selectMenu = this.getSelectedMenu(list, pathname);
            const selectedKeys = selectMenu ? [`${selectMenu.id}`] : [];
            const openKeys = selectMenu ? selectMenu.treeId : [];

            return (
                <React.Fragment>
                    <div className="wrap">

                        <div className="layout-left">
                            <Sider>
                                <SiderMenu menuTreeList={list} selectedKeys={selectedKeys} openKeys={openKeys} rootSubmenuKeys={this.rootSubmenuKeys} />
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
                    </div>
                </React.Fragment>
            );
        } else {
            return (
                null
            );
        }
    }
}


// export default BasicLayout
const BasicLayoutWithRouter = withRouter(BasicLayout)

export default BasicLayoutWithRouter