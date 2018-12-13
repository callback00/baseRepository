import React from 'react'
import { Input, Table, Modal, message, Transfer } from 'antd'

import tools from '../../utils/tools'

const Search = Input.Search;


class Page extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            roleUserIdList: [],
            allUserList: []
        }
    }

    componentWillMount() {
        if (this.props.roleId) {
            this.getData()
        }
    }

    getData() {
        tools.post('/role/getRoleUserByRoleId', (json) => {
            if (json.success) {
                this.setState({ roleUserIdList: json.success.roleUserIdList, allUserList: json.success.allUserList })
            } else {
                message.error('角色用户获取失败，请联系管理员')
            }
        }, { roleId: this.props.roleId })

    }

    handleOk() {

        tools.post('/role/roleUserEdit', (json) => {
            if (json.success) {
                this.props.onOk();
                message.success('保存成功')
            } else {
                message.error('保存失败，请联系管理员')
            }
        }, { roleId: this.props.roleId, userIdList: this.state.roleUserIdList })
    }

    handleCancel() {
        this.props.onCancel();
    }

    handleTransferChange(targetKeys, direction, moveKeys) {
        console.log(targetKeys, direction, moveKeys);
        this.setState({ roleUserIdList: targetKeys });
    }

    renderModal() {
        return (
            <div className="role-user-modal" >

                <Transfer
                    dataSource={this.state.allUserList}
                    rowKey={record => record.userId}
                    locale={
                        { itemUnit: '项', itemsUnit: '项', notFoundContent: '列表为空' }
                    }
                    listStyle={{
                        width: 300,
                        height: 300,
                    }}
                    targetKeys={this.state.roleUserIdList}
                    onChange={this.handleTransferChange.bind(this)}
                    render={(record) => {
                        return {
                            label: record.userName ? record.loginName + ` -- ${record.userName}` : record.loginName, // for displayed item
                            value: record.userId, // for title and filter matching
                        };
                    }}
                />
            </div>
        )
    }

    render() {

        return (

            <Modal
                title="编辑角色用户"
                width={800}
                visible={this.props.visible}
                key={this.props.modalKey}
                onOk={this.handleOk.bind(this)}
                okText="保存"
                onCancel={this.handleCancel.bind(this)}
                cancelText="关闭"
            >
                {this.renderModal()}
            </Modal>
        )
    }
}

export default Page
