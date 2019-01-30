import assign from 'lodash.assign'
import React from 'react'
import { Link } from 'react-router-dom'
import { message, notification, Popconfirm, Table } from 'antd'

import MenuPermissionModal from './menuPermissionModal'
import ApiPermissionModal from './apiPermissionModal'
import userjs from '../../utils/user'

class UserList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            datas: [],
            pagination: {
                showQuickJumper: true,
                showSizeChanger: true
            },
            loading: false,

            permissionModalKey: 0,
            menuPermissionModalVisible: false,
        }
    }

    componentWillMount() {
        this.getUserList()
    }

    getUserList() {
        userjs.getUserList((json) => {
            if (json.success) {
                // console.log('----- success -----' + json.success)
                this.setState({ datas: json.success })
            } else {
                message.warning(json.error)
                // console.log('----- error -----' + json.error)
            }
        })
    }

    menuPermissionModalShow(user) {
        const permissionModalKey = this.state.permissionModalKey + 1;
        this.setState({
            menuPermissionModalVisible: true,
            permissionModalKey,
            userId: user.userId,
            loginName: user.loginName,
        });
    }

    handleMenuPermissionOk() {
        this.setState({
            menuPermissionModalVisible: false
        });
    }

    handleMenuPermissionCancel() {
        this.setState({
            menuPermissionModalVisible: false
        });
    }

    apiPermissionModalShow(user) {
        const permissionModalKey = this.state.permissionModalKey + 1;
        this.setState({
            apiPermissionModalVisible: true,
            permissionModalKey,
            userId: user.userId,
            loginName: user.loginName,
        });
    }

    handleApiPermissionOk() {
        this.setState({
            apiPermissionModalVisible: false
        });
    }

    handleApiPermissionCancel() {
        this.setState({
            apiPermissionModalVisible: false
        });
    }

    deleteBtnClick(index) {
        const datas = this.state.datas
        const data = datas[index]

        this.setState({ loading: true })

        userjs.deleteUser(data.userId, (json) => {
            if (json.success) {
                datas.splice(index, 1)
                this.setState({ datas })

                notification.success({
                    message: `删除用户 ${data.displayName} 成功!`,
                    description: null
                })
            } else {
                message.warning(json.error)
                // console.log('----- error -----' + json.error)
            }

            this.setState({ loading: false })
        })
    }

    render() {
        const dataSource = this.state.datas.map((data, index) => {
            return assign({}, data, {
                key: index,
                index: index + 1
            })
        })

        const columns = [{
            title: '序号',
            dataIndex: 'index',
            key: 'index'
        }, {
            title: '用户名',
            dataIndex: 'displayName',
            key: 'displayName',
        }, {
            title: '登录账号',
            dataIndex: 'loginName',
            key: 'loginName',
        }, {
            title: '操作',
            key: 'operation',
            render: (text, record) => {
                return (
                    <span>
                        <Link to={`/user/info/${record.userId}`}>查看</Link>
                        &nbsp;&nbsp;&nbsp;
            <a onClick={this.menuPermissionModalShow.bind(this, record)} >菜单权限</a>
                        &nbsp;&nbsp;&nbsp;
            <a onClick={this.apiPermissionModalShow.bind(this, record)} >api权限</a>
                        &nbsp;&nbsp;&nbsp;
            <Popconfirm okText="确定" cancelText="取消" onConfirm={this.deleteBtnClick.bind(this, record.key)} title="确定要删除此条记录吗？">
                            <a>删除</a>
                        </Popconfirm>
                    </span>
                )
            }
        }]

        return (
            <div style={{ background: 'white', padding: '15px' }} >
                <Table
                    columns={columns}
                    dataSource={dataSource}
                    loading={this.state.loading}
                    pagination={this.state.pagination}
                />

                <div>
                    <MenuPermissionModal
                        visible={this.state.menuPermissionModalVisible}
                        userId={this.state.userId}
                        key={'menu' + this.state.permissionModalKey}
                        modalKey={this.state.permissionModalKey}
                        loginName={this.state.loginName}
                        onOk={this.handleMenuPermissionOk.bind(this)}
                        onCancel={this.handleMenuPermissionCancel.bind(this)}
                    />

                    <ApiPermissionModal
                        visible={this.state.apiPermissionModalVisible}
                        userId={this.state.userId}
                        key={'api' + this.state.permissionModalKey}
                        modalKey={this.state.permissionModalKey}
                        loginName={this.state.loginName}
                        onOk={this.handleApiPermissionOk.bind(this)}
                        onCancel={this.handleApiPermissionCancel.bind(this)}
                    />
                </div>
            </div>
        )
    }
}

export default UserList
