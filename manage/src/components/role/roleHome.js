import assign from 'lodash.assign'
import React from 'react'
import { Link } from 'react-router-dom'
import { message, Divider, Popconfirm, Table } from 'antd'

import RoleModal from './roleModal'
import Role_User_Modal from './role_UserModal'
import Role_Menu_Permission_Modal from './role_MenuPermissionModal'
import Role_Api_Permission_Modal from './role_ApiPermissionModal'
import tools from '../../utils/tools'

class Page extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            pagination: {
                showQuickJumper: true,
                showSizeChanger: true
            },

            roleId: null,

            modalKey: 0,
            roleModalVisible: false,
            roleUserModalVisible: false,
            menuPermissionModalVisible: false,
            apiPermissionModalVisible: false
        }
    }

    componentDidMount() {
        this.getRoleList()
    }

    getRoleList() {
        tools.get('/role/getRoleList', (json) => {
            if (json.success) {
                this.setState({ data: json.success });
            } else {
                message.error(json.error)
            }
        })
    }

    // 编辑或添加角色弹出框
    roleModalShow(role) {
        const modalKey = this.state.modalKey + 1;
        this.setState({
            roleModalVisible: true,
            modalKey,
            roleId: role ? role.id : null,
            roleName: role.name,
        });
    }

    handleRoleOk() {
        this.setState({
            roleModalVisible: false
        });

        this.getRoleList();

        message.success("添加成功")
    }

    handleRoleCancel() {
        this.setState({
            roleModalVisible: false
        });
    }

    // 显示角色用户添加弹出框
    roleUserModalShow(role) {
        const modalKey = this.state.modalKey + 1;
        this.setState({
            roleUserModalVisible: true,
            modalKey,
            roleId: role.id,
            roleName: role.name,
        });
    }

    handleRoleUserOk() {
        this.setState({
            roleUserModalVisible: false
        });
    }

    handleRoleUserCancel() {
        this.setState({
            roleUserModalVisible: false
        });
    }

    // 显示角色菜单权限编辑弹出框
    menuPermissionModalShow(role) {
        const modalKey = this.state.modalKey + 1;
        this.setState({
            menuPermissionModalVisible: true,
            modalKey,
            roleId: role.id,
            roleName: role.name,
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

    // 显示角色api权限编辑弹出框
    apiPermissionModalShow(role) {
        const modalKey = this.state.modalKey + 1;
        this.setState({
            apiPermissionModalVisible: true,
            modalKey,
            roleId: role.id,
            roleName: role.name,
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

    // 删除角色
    deleteBtnClick(roleId) {
        tools.del('/role/roleDelete', (json) => {
            if (json.success) {
                message.success(json.success);
                this.getRoleList();
            } else {
                message.error(json.error);
            }
        }, { idArry: [roleId] })
    }

    renderTableHeader() {
        return (
            <div>
                <button className='btn-add' onClick={this.roleModalShow.bind(this)}>新增</button>
            </div>
        )
    }

    render() {
        const dataSource = this.state.data.map((data, index) => {
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
            title: '角色',
            dataIndex: 'name',
            key: 'name',
        }, {
            title: '描述',
            dataIndex: 'remark',
            key: 'remark',
        }, {
            title: '操作',
            key: 'operation',
            render: (text, record) => {
                return (
                    <span>
                        <a onClick={this.roleModalShow.bind(this, record)} >编辑</a>
                        <Divider type="vertical" />
                        <a onClick={this.roleUserModalShow.bind(this, record)} >角色用户</a>
                        <Divider type="vertical" />
                        <a onClick={this.menuPermissionModalShow.bind(this, record)} >菜单权限</a>
                        <Divider type="vertical" />
                        <a onClick={this.apiPermissionModalShow.bind(this, record)} >api权限</a>
                        <Divider type="vertical" />
                        <Popconfirm onConfirm={this.deleteBtnClick.bind(this, record.id)} okText="确定" cancelText="取消" title="确定要删除此条记录吗？">
                            <a>删除</a>
                        </Popconfirm>
                    </span>
                )
            }
        }]

        return (
            <div style={{ background: 'white', padding: '15px' }} >
                <Table
                    title={this.renderTableHeader.bind(this)}
                    columns={columns}
                    dataSource={dataSource}
                    loading={this.state.loading}
                    pagination={this.state.pagination}
                    bordered
                    size="small"
                />

                <div>
                    <RoleModal
                        visible={this.state.roleModalVisible}
                        roleId={this.state.roleId}
                        key={'role' + this.state.modalKey}
                        modalKey={this.state.modalKey}
                        onOk={this.handleRoleOk.bind(this)}
                        onCancel={this.handleRoleCancel.bind(this)}
                    />

                    <Role_User_Modal
                        visible={this.state.roleUserModalVisible}
                        roleId={this.state.roleId}
                        roleName={this.state.roleName}
                        key={'roleUser' + this.state.modalKey}
                        modalKey={this.state.modalKey}
                        onOk={this.handleRoleUserOk.bind(this)}
                        onCancel={this.handleRoleUserCancel.bind(this)}
                    />

                    <Role_Menu_Permission_Modal
                        visible={this.state.menuPermissionModalVisible}
                        roleId={this.state.roleId}
                        roleName={this.state.roleName}
                        key={'menu' + this.state.modalKey}
                        modalKey={this.state.modalKey}
                        onOk={this.handleMenuPermissionOk.bind(this)}
                        onCancel={this.handleMenuPermissionCancel.bind(this)}
                    />

                    <Role_Api_Permission_Modal
                        visible={this.state.apiPermissionModalVisible}
                        roleId={this.state.roleId}
                        roleName={this.state.roleName}
                        key={'api' + this.state.modalKey}
                        modalKey={this.state.modalKey}
                        onOk={this.handleApiPermissionOk.bind(this)}
                        onCancel={this.handleApiPermissionCancel.bind(this)}
                    />
                </div>
            </div>
        )
    }
}

export default Page
