import React from 'react'
import { Button, Checkbox, Form, Icon, Input, message, notification } from 'antd'

import userjs from '../../utils/user'

const { create, Item } = Form

class Useradd extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      rulelist: [],
      rules: {},
      secure: true,
      loading: false
    }

    this.checkboxChange = this.checkboxChange.bind(this)
    this.checkboxSecure = this.checkboxSecure.bind(this)
    this.checkAll = this.checkAll.bind(this)

    this.saveBtnClick = this.saveBtnClick.bind(this)
    this.resetBtnClick = this.resetBtnClick.bind(this)
  }

  componentWillMount() {
    this.getRuleList()
  }

  getRuleList() {
    userjs.getRuleList((json) => {
      if (json.success) {
        // console.log('----- success -----' + json.success)
        this.setState({ rulelist: json.success })
      } else if (json.auth) {
        message.warning(json.auth)
      } else {
        message.warning(json.error)
        // console.log('----- error -----' + json.error)
      }
    })
  }

  checkboxSecure(event) {
    this.setState({ secure: !event.target.checked })
  }

  checkboxChange(event) {
    const rules = this.state.rules
    rules[event.target.value] = event.target.checked

    this.setState({ rules })
  }

  checkAll(event) {
    const rules = {}
    this.state.rulelist.forEach((data) => {
      rules[data.ruleid] = event.target.checked
    })

    this.setState({ rules })
  }

  resetBtnClick() {
    this.props.form.resetFields()
    this.setState({ rules: {} })
  }

  saveBtnClick() {
    if (this.state.loading) {
      return
    }

    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        return
      }

      values.adds = []
      for (const ruleid in this.state.rules) {
        if (this.state.rules[ruleid]) {
          values.adds.push(ruleid)
        }
      }

      this.setState({ loading: true })

      userjs.createUser(values, (json) => {
        if (json.success) {
          // console.log('----- success -----' + json.success)
          notification.success({
            message: `新建用户 ${values.displayname} 成功!`,
            description: null
          })

          this.resetBtnClick()
        } else if (json.auth) {
          message.warning(json.auth)
        } else {
          message.warning(json.error)
          // console.log('----- error -----' + json.error)
        }

        this.setState({ loading: false })
      })
    })
  }

  render() {
    let count = 0
    const checkboxs = this.state.rulelist.map((rule) => {
      const checked = this.state.rules[rule.ruleid]
      if (checked) {
        count++
      }

      return (
        <span key={rule.ruleid} className="ant-checkbox-vertical">
          <Checkbox
            checked={checked}
            onChange={this.checkboxChange.bind(this)}
            value={rule.ruleid} /> {rule.rulename}
        </span>
      )
    })

    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 12 }
    }

    const secure = this.state.secure ? 'password' : 'text'

    return (
      <Form>

        <Item
          {...formItemLayout}
          label="登录名"
          hasFeedback>
          {getFieldDecorator('loginname', {
            rules: [
              { required: true, message: '请填写登录名' },
              { max: 50, message: '不能超过50字' },
            ]
          })(
            <Input placeholder="登录名" />
          )}
        </Item>

        <Item
          {...formItemLayout}
          label="昵称"
          hasFeedback>
          {getFieldDecorator('displayname', {
            rules: [
              { required: true, message: '请填写昵称' },
              { max: 50, message: '不能超过50字' },
            ]
          })(
            <Input placeholder="昵称" />
          )}
        </Item>

        <Item
          {...formItemLayout}
          label="联系电话"
          hasFeedback>
          {getFieldDecorator('telphone', {
            rules: [
              { max: 20, message: '不能超过20位' },
            ]
          })(
            <Input placeholder="联系电话" />
          )}
        </Item>

        <Item
          {...formItemLayout}
          label="密码"
          hasFeedback>
          {getFieldDecorator('password', {
            rules: [
              { required: true, message: '请填写密码' },
              { max: 50, message: '不能超过50字' },
            ]
          })(
            <Input placeholder="密码" type={secure} />
          )}
        </Item>

        <Item
          {...formItemLayout}
          label="显示密码">
          <Checkbox
            checked={ !this.state.secure }
            onChange={ this.checkboxSecure } />
        </Item>

        <Item
          {...formItemLayout}
          label="权限">

          <span className="ant-checkbox-vertical">
            <Checkbox
              checked={count === this.state.rulelist.length}
              onChange={ this.checkAll }
              value="0" /> <a>全选</a>
          </span>

          {checkboxs}

        </Item>

        <Item wrapperCol={{ offset: 3 }}>
          <Button
            loading={this.state.loading}
            onClick={ this.saveBtnClick }
            type="primary">
            <Icon type="save" />确定
          </Button>
          &nbsp;&nbsp;&nbsp;
          <Button type="ghost" onClick={ this.resetBtnClick }>
            <Icon type="reload" />重置
          </Button>
        </Item>
      </Form>
    )
  }
}

Useradd = create()(Useradd)

export default Useradd
