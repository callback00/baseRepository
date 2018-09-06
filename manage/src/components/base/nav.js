import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Menu, Icon } from 'antd'

import menu from '../../utils/menu'
import auth from '../../utils/auth'

const { SubMenu } = Menu

class Nav extends Component {
  constructor(props) {
    super(props)

    this.menulist = []
  }

  renderMenu() {

    return this.menulist.map((data) => {
      const items = data.child ? data.child.map((item) => {
        return (
          <Menu.Item key={item.key}>
            <Link to={{ pathname: item.link }} style={item.style}>{item.title}</Link>
          </Menu.Item>
        )
      }) : ''

      const menuItem = items.length > 0 ? (
        <SubMenu key={data.key} title={<span><Icon type={data.icon} /><span>{data.title}</span></span>}>
          {items}
        </SubMenu>
      ) : (
          <Menu.Item key={data.key} style={data.style}>
            <Link to={{ pathname: data.link }}><Icon type={data.icon} />{data.title}</Link>
          </Menu.Item>
        )

      return menuItem
    })
  }

  // 根据路径选择菜单，同时记录父节点路径
  getSelectedMenu(menulist, pathname, parent = null) {
    for (const item of menulist) {
      if (parent) {
        item.parentPathKeys = item.parentPath ? item.parentPath + '.' + parent.key : parent.key
      }
      if (item.child && item.child.length > 0) {
        const selectItem = this.getSelectedMenu(item.child, pathname, item);
        if (selectItem) {
          return selectItem
        }
      } else {
        if (item.link === pathname) {
          return item
        }
      }
    };
  }

  render() {
    const { pathname } = this.props.location

    const list = auth.getPath()
    if (list) {
      this.menulist = []; // 置空
      for (const key in menu) {
        const has = list.some((data) => {
          return data === key
        })

        if (has) {
          this.menulist.push(menu[key])
        }
      }
    }

    const selectMenu = this.getSelectedMenu(this.menulist, pathname);

    const defaultSelectedKeys = [];
    let defaultOpenKeys = []
    if (selectMenu) {
      defaultSelectedKeys.push(selectMenu.key)
      defaultOpenKeys = selectMenu.parentPathKeys ? selectMenu.parentPathKeys.split('.') : []
    }

    return (
      <Menu
        mode="inline"
        theme="dark"
        style={{ padding: '80px 0 60px 0' }}
        defaultSelectedKeys={defaultSelectedKeys}
        defaultOpenKeys={defaultOpenKeys}
      >
        {this.renderMenu()}
      </Menu>
    )
  }
}

const NavWithRouter = withRouter(Nav)

export default NavWithRouter