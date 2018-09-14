import assign from 'lodash.assign'
import React from 'react'
import { Link } from 'react-router-dom'
import { message, notification, Popconfirm, Table } from 'antd'

import UserPermissionModal from './userPermissionModal'
import userjs from '../../utils/user'

class Userlist extends React.Component {
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
      permissionModalVisible: false,
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

  permissionModalShow(user) {
    const permissionModalKey = this.state.permissionModalKey + 1;
    this.setState({
      permissionModalVisible: true,
      permissionModalKey,
      userId: user.userId,
      loginName: user.loginName,
    });
  }

  handlePermissionOk() {
    this.setState({
      permissionModalVisible: false
    });
  }

  handlePermissionCancel() {
    this.setState({
      permissionModalVisible: false
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
            <Link to={`/dashboard/user/info/${record.userId}`}>查看</Link>
            &nbsp;&nbsp;&nbsp;
            <a onClick={this.permissionModalShow.bind(this, record)} >权限</a>
            &nbsp;&nbsp;&nbsp;
            <Popconfirm onConfirm={this.deleteBtnClick.bind(this, record.key)} title="确定要删除此条记录吗？">
              <a>删除</a>
            </Popconfirm>
          </span>
        )
      }
    }]

    return (
      <div>
        <Table
          columns={columns}
          dataSource={dataSource}
          loading={this.state.loading}
          pagination={this.state.pagination}
        />

        <div>
          <UserPermissionModal
            visible={this.state.permissionModalVisible}
            userId={this.state.userId}
            key={this.state.permissionModalKey}
            modalKey={this.state.permissionModalKey}
            loginName={this.state.loginName}
            onOk={this.handlePermissionOk.bind(this)}
            onCancel={this.handlePermissionCancel.bind(this)}
          />
        </div>
      </div>
    )
  }
}

export default Userlist
