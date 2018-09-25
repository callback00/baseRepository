import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Menu, Icon } from 'antd'

const { SubMenu } = Menu

class Page extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div>
                这是首页工作台
            </div>
        )
    }
}

// 不是通过路由跳转过来的，而是直接从浏览器中输入地址打开的，如果不使用withRouter，没法执行props中的history、location、match等方法。
const PageEx = withRouter(Page)

export default PageEx