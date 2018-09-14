import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Menu, Icon, message } from 'antd'

import auth from '../utils/auth'
import tools from '../utils/tools'

const { SubMenu } = Menu

class Nav extends Component {
    constructor(props) {
        super(props)
        this.state = {
            menuTreeList: [],

            defaultSelectedKeys: [],
            defaultOpenKeys: []
        }

    }

    // 根据路径选择菜单，同时记录父节点路径
    getSelectedMenu(menuTreeList, pathname, parent = null) {
        for (const item of menuTreeList) {
            if (item.children && item.children.length > 0) {
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
                return (
                    <Menu.Item key={`${menu.id}`}>
                        <Link to={{ pathname: menu.menuLink }}>{menu.icon ? <Icon type={menu.icon} /> : ''}{menu.name}</Link>
                    </Menu.Item>
                )
            }
        });

        return menus;
    }

    render() {

        const { pathname } = this.props.location;

        const menuTreeList = this.props.menuTreeList;
        const selectMenu = this.getSelectedMenu(menuTreeList, pathname);
        const defaultSelectedKeys = selectMenu ? [`${selectMenu.id}`] : [];
        const defaultOpenKeys = selectMenu ? selectMenu.treeId : [];

        return (
            <Menu
                mode="inline"
                theme="dark"
                style={{ padding: '80px 0 60px 0' }}
                defaultSelectedKeys={defaultSelectedKeys}
                defaultOpenKeys={defaultOpenKeys}
            >
                {this.renderMenu(menuTreeList)}
            </Menu>
        )
    }
}

const NavWithRouter = withRouter(Nav)

export default NavWithRouter