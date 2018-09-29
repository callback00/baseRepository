import React, { Component } from 'react';
import { Menu } from 'antd';
import { Link, Route, withRouter } from 'react-router-dom'

const { Item } = Menu;

import SecurityView from './securityView'
import BaseView from './baseView'

class Info extends Component {
    constructor(props) {
        super(props);
        const { match, location } = props;
        const menuMap = [
            {
                key: 'base',
                title: '基本设置',
                menuLink: 'account/setting/base',
                component: BaseView
            },
            {
                key: 'security',
                title: '密码设置',
                menuLink: '/account/setting/security',
                component: SecurityView
            }
        ]
        const key = location.pathname.replace(`${match.path}/`, '');
        const selectMenu = menuMap.filter((item) => {
            return item.key === key;
        })[0]

        this.state = {
            mode: 'inline',
            menuMap,
            selectKey: selectMenu ? selectMenu.key : 'base',
            selectMenu: selectMenu ? selectMenu : menuMap[0]
        };

        this.resize = this.resize.bind(this);
    }

    componentDidMount() {
        window.addEventListener('resize', this.resize);
        this.resize();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resize);
    }

    getmenu() {
        const menuItem = this.state.menuMap.map((item) => {
            return (
                <Menu.Item key={item.key}>
                    <span>{item.title}</span>
                </Menu.Item>
            )
        })

        return menuItem;
    };

    getRightTitle() {
        const { selectKey, menuMap } = this.state;

        const menu = menuMap.filter((item) => {
            return item.key === selectKey;
        })[0]

        return menu ? menu.title : '';
    };

    selectKey({ key }) {
        this.props.history.push(`/account/setting/${key}`);
        const menu = this.state.menuMap.filter((item) => {
            return item.key === key;
        })[0]
        this.setState({
            selectKey: key,
            selectMenu: menu
        });
    };

    resize() {
        if (!this.main) {
            return;
        }
        requestAnimationFrame(() => {
            let mode = 'inline';
            const { offsetWidth } = this.main;
            if (offsetWidth < 641 && offsetWidth > 400) {
                mode = 'horizontal';
            }
            if (window.innerWidth < 768 && offsetWidth > 400) {
                mode = 'horizontal';
            }
            this.setState({
                mode,
            });
        });
    };

    render() {

        const { mode, selectKey } = this.state;

        let layoutMode = mode === 'inline' ? 'sider' : ''
        if (window.innerWidth < 768) {
            layoutMode = ''
        }

        const MenuContent = this.state.selectMenu.component
        return (

            <div
                className={`account-setting ${layoutMode}`}
                ref={ref => {
                    this.main = ref;
                }}
            >
                <div className="account-setting-menu">
                    <Menu mode={mode} selectedKeys={[selectKey]} onClick={this.selectKey.bind(this)}>
                        {this.getmenu()}
                    </Menu>
                </div>
                <div className='account-setting-content'>
                    <div className="account-setting-content-title">
                        {this.getRightTitle()}
                    </div>
                    <MenuContent history={this.props.history} />
                </div>
            </div>
        );
    }
}

const InfoWithRouter = withRouter(Info)

export default InfoWithRouter
