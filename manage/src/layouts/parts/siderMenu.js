import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Menu, Icon } from 'antd'

import systemMenu from '../../../config/systemMenu.config'

const { SubMenu } = Menu

class SiderMenu extends Component {
    constructor(props) {
        super(props)
        this.state = {
            menuTreeList: [],

            defaultSelectedKeys: [],
            defaultOpenKeys: [],
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
                // 过滤掉页面路由
                if (parseInt(menu.menuType) === 1) {
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

        // 注意，在这里是无法通过this.props.match获取到参数的，要获取/:xxx的参数只能在本组件内调用才能获取到。
        const { pathname } = this.props.location;

        const menuTreeList = this.props.menuTreeList;
        const list = [...menuTreeList, ...systemMenu]
        const selectMenu = this.getSelectedMenu(list, pathname);

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
                {this.renderMenu(list)}
            </Menu>
        )
    }
}

// export default SiderMenu

const SiderMenuWithRouter = withRouter(SiderMenu)

export default SiderMenuWithRouter