import assign from 'lodash.assign'
import React from 'react'
import { Link } from 'react-router-dom'
import { message, notification, Popconfirm, Table } from 'antd'

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
      loading: false
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

  deleteBtnClick(index) {
    const datas = this.state.datas
    const data = datas[index]

    this.setState({ loading: true })

    userjs.deleteUser(data.userid, (json) => {
      if (json.success) {
        datas.splice(index, 1)
        this.setState({ datas })

        notification.success({
          message: `删除用户 ${data.displayname} 成功!`,
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
      dataIndex: 'displayname',
      key: 'displayname',
    }, {
      title: '登录账号',
      dataIndex: 'loginname',
      key: 'loginname',
    }, {
      title: '操作',
      key: 'operation',
      render: (text, record) => {
        return (
          <span>
            <Link to={`/dashboard/user/info/${record.userid}`}>查看</Link>
            &nbsp;&nbsp;&nbsp;
            <Popconfirm onConfirm={ this.deleteBtnClick.bind(this, record.key) } title="确定要删除此条记录吗？">
              <a>删除</a>
            </Popconfirm>
          </span>
        )
      }
    }]

    return (
      <Table
        columns={columns}
        dataSource={dataSource}
        loading={this.state.loading}
        pagination={this.state.pagination} />
    )
  }
}

export default Userlist
