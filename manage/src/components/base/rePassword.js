import React, { Component } from 'react'
import { Input, Button, Form, message } from 'antd'
// import auth from '../utils/auth' // 登录验证方法
import tools from '../../utils/tools'

const FormItem = Form.Item;

class Repassword extends Component {
  constructor(props) {
    super(props)
    this.state = {
      confirmDirty: false,
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.checkPassword = this.checkPassword.bind(this)
    this.checkConfirm = this.checkConfirm.bind(this)
    this.handleConfirmBlur = this.handleConfirmBlur.bind(this)
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const md5Exprire = tools.md5password(values.expire)
        const md5Password = tools.md5password(values.password)
        tools.post(`/password`, (json) => {
          if (json.success) {
            this.props.logout()
            message.success('修改密码成功，请重新登录')
          } else {
            message.error(json.error)
          }
        }, { expire: md5Exprire, password: md5Password });
      }
    });
  }

  handleConfirmBlur(e) {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }

  checkPassword(rule, value, callback) {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('两次输入的密码不一致');
    } else {
      callback();
    }
  }

  checkConfirm(rule, value, callback) {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  }


  render() {
    const { getFieldDecorator } = this.props.form;
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 14,
          offset: 6,
        },
      },
    };
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    };
    return (
      <div style={{ margin: '100px auto', width: '500px' }}>
        <Form onSubmit={this.handleSubmit}>
          <FormItem
            {...formItemLayout}
            label="旧密码"
          >
            {getFieldDecorator('expire', {
              rules: [{
                required: true, message: '请输入您的旧密码',
              }],
            })(
              <Input type="password" />
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="新密码"
          >
            {getFieldDecorator('password', {
              rules: [{
                required: true, message: '请输入您的新密码',
              }, {
                validator: this.checkConfirm,
              }],
            })(
              <Input type="password" />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="确认新密码"
            hasFeedback
          >
            {getFieldDecorator('confirm', {
              rules: [{
                required: true, message: '请确认您的新密码',
              }, {
                validator: this.checkPassword,
              }],
            })(
              <Input type="password" onBlur={this.handleConfirmBlur} />
            )}
          </FormItem>

          <FormItem {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit" size="large">修改密码</Button>
          </FormItem>
        </Form>
      </div>
    )
  }
}

export default Form.create()(Repassword)
