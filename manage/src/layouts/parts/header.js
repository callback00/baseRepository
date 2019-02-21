import React from 'react';
import { Menu, Icon, Dropdown, Badge, Popover, Tabs, List, Avatar, notification } from 'antd';
import auth from '../../utils/auth';
import tools from '../../utils/tools'
import moment from 'moment'

import io from 'socket.io-client';
const config = require('../../../config/config')

const TabPane = Tabs.TabPane;

notification.config({
    placement: 'bottomRight',
});

class Header extends React.PureComponent {
    constructor(props) {
        super(props);
        this.socket = null; //登出时需停止监听

        this.state = {
            unReadMsgCount: 0,
            messageData: []
        }
    }

    componentDidMount() {

        //websocket与后台保持通讯
        if (config.notice_open) {
            const token = window.localStorage.getItem('system-manage-token')
            this.socket = io(config.socketUrl, {
                query: {
                    token
                }
            });

            const socket = this.socket;

            socket.on('connect', () => {
                console.log(socket.id);
            });

            socket.on('connect_error', () => {
                notification.open({
                    message: '无法获取消息',
                    description: '连接消息服务器失败，无法获取实时消息，请联系管理员',
                    icon: <Icon type="warning" style={{ color: '#108ee9' }} />,
                });
            });

            socket.on('connect_failed', () => {
                notification.open({
                    message: '无法获取消息',
                    description: '连接消息服务器失败，无法获取实时消息，请联系管理员',
                    icon: <Icon type="warning" style={{ color: '#108ee9' }} />,
                });
            });

            socket.on('newMessage', (result) => {

                if (this.state.unReadMsgCount !== result.unReadMsgCount) {
                    this.setState({
                        unReadMsgCount: result.unReadMsgCount
                    })
                }
                result.data.forEach(item => {
                    notification.open({
                        message: item.noticeTitle ? item.noticeTitle : '您有新的消息',
                        description: item.noticeContent,
                        icon: <Icon type="smile" style={{ color: '#108ee9' }} />,
                    });
                });
            });

            socket.on('error', (data) => {
                notification.open({
                    message: '获取消息出错',
                    description: `${data}`,
                    icon: <Icon type="warning" style={{ color: '#108ee9' }} />,
                });
            });
        }
    }

    onMenuClick({ key }) {
        if (key === 'userinfo') {
            this.props.history.push('/account/setting/base');
            return;
        }
        if (key === 'logout') {

            if (config.notice_open) {
                this.socket.emit('loginOut');
            }

            auth.logout();
            this.props.history.push('/login')
        }
    }

    getNoticeClick() {
        // 获取未读的数据
        tools.get('/noticeDetail/getUserUnReadNoticeList', (json) => {
            if (json.success) {
                this.setState({
                    messageData: json.success.data
                })
            } else {
                message.error(json.error);
            }
        })
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
                <TabPane tab={this.state.messageData.length > 0 ? `消息 (${this.state.messageData.length})` : '消息'} key="1">
                    <div>
                        <List
                            itemLayout="horizontal"
                            dataSource={this.state.messageData}
                            renderItem={item => (
                                <List.Item style={{ paddingLeft: '15px', paddingRight: '15px' }}>
                                    <List.Item.Meta
                                        avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                                        title={<a href="https://ant.design">{item.noticeTitle}</a>}
                                        description={
                                            <div>
                                                <div style={{ fontSize: '12px' }} >{item.noticeContent}</div>
                                                <div style={{ fontSize: '12px' }} >{moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss')}</div>
                                            </div>
                                        }
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
                        <Popover overlayClassName="notice-pop" arrowPointAtCenter onClick={this.getNoticeClick.bind(this)} content={noticeContent} trigger="click" placement="bottom">
                            <Badge count={this.state.unReadMsgCount}>
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