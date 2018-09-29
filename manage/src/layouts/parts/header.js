import React from 'react'
import { Menu, Icon, Dropdown, Badge, Popover, Tabs, List, Avatar } from 'antd';
import auth from '../../utils/auth'

const TabPane = Tabs.TabPane;


const messageData = [
    {
        title: 'Ant Design Title 1',
    },
    {
        title: 'Ant Design Title 2',
    },
    {
        title: 'Ant Design Title 3',
    },
    {
        title: 'Ant Design Title 4',
    },
]

class Header extends React.PureComponent {
    constructor(props) {
        super(props)
    }

    onMenuClick({ key }) {
        if (key === 'userinfo') {
            this.props.history.push('/account/setting/base');
            return;
        }
        if (key === 'logout') {
            auth.logout();
            this.props.history.push('/login')
        }
    }

    render() {
        const menu = (
            <Menu selectedKeys={[]} onClick={this.onMenuClick.bind(this)}>
                <Menu.Item key="userinfo">
                    <Icon type="setting" />
                    <span>个人中心</span>
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item key="logout">
                    <Icon type="logout" />
                    <span>退出登录</span>
                </Menu.Item>
            </Menu>
        );

        const noticeContent = (
            <Tabs style={{ width: '300px', minHeight: '175px' }} tabBarStyle={{ padding: '0 10px', margin: '0' }} defaultActiveKey="1">
                <TabPane tab={messageData.length > 0 ? `消息 (${messageData.length})` : '消息'} key="1">
                    <div>
                        <List
                            itemLayout="horizontal"
                            dataSource={messageData}
                            renderItem={item => (
                                <List.Item style={{ paddingLeft: '15px', paddingRight: '15px' }}>
                                    <List.Item.Meta
                                        avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                                        title={<a href="https://ant.design">{item.title}</a>}
                                        description={(<div style={{ fontSize: '12px' }} >2018-10-01 00:00:00</div>)}
                                    />
                                </List.Item>
                            )}
                        />
                        <div style={{ borderTop: '1px solid #e8e8e8', textAlign: 'center', height: '45px', lineHeight: '45px' }}>
                            查看 更多
                        </div>
                    </div>
                </TabPane>
                <TabPane tab="待办" key="2">
                    <div style={{ padding: '0 15px' }}>
                        <div style={{ height: '100%', lineHeight: '175px', textAlign: 'center' }}>
                            暂无待办事宜
                        </div>
                    </div>
                </TabPane>
            </Tabs>

        );

        return (
            <div className="system-header">
                <div className="right-content">
                    <span className="notice" style={{ marginRight: '30px' }} >
                        <Popover overlayClassName="notice-pop" arrowPointAtCenter content={noticeContent} trigger="click" placement="bottom">
                            <Badge count={5}>
                                <img style={{ height: '15px', width: '15px' }} src="/manage/images/icon/layout-header/notice.png" alt="无" />
                            </Badge>
                        </Popover>
                    </span>

                    <span className="user-info">
                        <Dropdown overlay={menu}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <img style={{ height: '25px', width: '25px' }} src="/manage/images/icon/layout-header/header-default.png" alt="无" />
                                <span>{auth.getName()}</span>
                            </div>
                        </Dropdown>
                    </span>
                </div>
            </div>
        )
    }
}

export default Header