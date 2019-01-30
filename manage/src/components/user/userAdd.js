import React from 'react'
import { Button, Checkbox, Form, Icon, Input, message, notification } from 'antd'

import userjs from '../../utils/user'

const { create, Item } = Form

class UserAdd extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            secure: true,
            loading: false
        }

        this.saveBtnClick = this.saveBtnClick.bind(this)
        this.resetBtnClick = this.resetBtnClick.bind(this)
    }

    componentWillMount() {

    }

    resetBtnClick() {
        this.props.form.resetFields()
    }

    saveBtnClick() {
        if (this.state.loading) {
            return
        }

        this.props.form.validateFieldsAndScroll((errors, values) => {
            if (!!errors) {
                return
            }

            this.setState({ loading: true })

            userjs.createUser(values, (json) => {
                if (json.success) {
                    // console.log('----- success -----' + json.success)
                    notification.success({
                        message: `新建用户 ${values.displayName} 成功!`,
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

        const { getFieldDecorator } = this.props.form
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 12 }
        }

        const secure = this.state.secure ? 'password' : 'text'

        return (
            <Form style={{ background: 'white', padding: '15px' }} >

                <Item
                    {...formItemLayout}
                    label="登录名"
                    hasFeedback>
                    {getFieldDecorator('loginName', {
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
                    {getFieldDecorator('displayName', {
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
                        checked={!this.state.secure}
                        onChange={this.checkboxSecure} />
                </Item>

                <Item wrapperCol={{ offset: 3 }}>
                    <Button
                        loading={this.state.loading}
                        onClick={this.saveBtnClick}
                        type="primary">
                        <Icon type="save" />确定
          </Button>
                    &nbsp;&nbsp;&nbsp;
          <Button type="ghost" onClick={this.resetBtnClick}>
                        <Icon type="reload" />重置
          </Button>
                </Item>
            </Form>
        )
    }
}

UserAdd = create()(UserAdd)

export default UserAdd
