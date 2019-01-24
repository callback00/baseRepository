import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Menu, Icon } from 'antd'

import systemMenu from '../../../config/systemMenu.config'

const { SubMenu } = Menu

class SiderMenu extends Component {
    constructor(props) {
        super(props)
        this.state = {
            openKeys: props.openKeys
        }

    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.openKeys !== this.state.openKeys) {
            this.setState({
                openKeys: nextProps.openKeys
            })
        }
    }

    onOpenChange(openKeys) {
        const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
        if (this.props.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
            this.setState({ openKeys });
        } else {
            this.setState({
                openKeys: latestOpenKey ? [latestOpenKey] : [],
            });
        }
    }

    renderMenu(menuTreeList) {
        const renderMenu = this.renderMenu.bind(this);
        const menus = menuTreeList.map((menu) => {
            if (menu.children && menu.children.length > 0) {
                return (
                    <SubMenu key={`${menu.id}`} title={<span> {menu.icon ? <Icon type={menu.icon} /> : ''} <span>{menu.name}</span></span>}>
                        {
                            renderMenu(menu.children)
                        }
                    </SubMenu>
                )
            } else {
                // 过滤掉页面路由
                if (parseInt(menu.menuType) !== 2) {
                    return (
                        <Menu.Item key={`${menu.id}`}>
                            <Link to={{ pathname: menu.menuLink }}>{menu.icon ? <Icon type={menu.icon} /> : ''}{menu.name}</Link>
                        </Menu.Item>
                    )
                } else {
                    return null
                }
            }
        });

        return menus;
    }

    render() {
        return (
            <Menu
                mode="inline"
                theme="dark"
                style={{ padding: '80px 0 60px 0' }}
                defaultSelectedKeys={this.props.selectedKeys}
                defaultOpenKeys={this.props.openKeys}
                selectedKeys={this.props.selectedKeys}

                openKeys={this.state.openKeys}
                onOpenChange={this.onOpenChange.bind(this)}
            >
                {this.renderMenu(this.props.menuTreeList)}
            </Menu>
        )
    }
}

const SiderMenuWithRouter = withRouter(SiderMenu)

export default SiderMenuWithRouter