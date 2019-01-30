import findIndex from 'lodash.findindex'
import React from 'react'
import { Button, Checkbox, Form, Icon, Input, message, notification } from 'antd'

import userjs from '../../utils/user'

const { create, Item } = Form

class UserInfo extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: {},
            secure: true,
            loading: false
        }

        this.saveBtnClick = this.saveBtnClick.bind(this)
        this.resetBtnClick = this.resetBtnClick.bind(this)
    }

    componentWillMount() {
        const { id } = this.props.match.params
        this.getUserInfo(id);
    }

    getUserInfo(userId) {
        userjs.getUserInfo(userId, (json) => {
            if (json.success) {
                // console.log('----- success -----' + json.success)
                const data = json.success
                this.setState({ data })
            } else {
                message.warning(json.error)
                // console.log('----- error -----' + json.error)
            }
        })
    }

    resetBtnClick() {
        this.props.history.push('/dashboard/user/add')
    }

    saveBtnClick() {
        if (this.state.loading) {
            return
        }

        this.props.form.validateFieldsAndScroll((errors, values) => {
            if (!!errors) {
                return
            }

            values.userId = this.state.data.userId

            this.setState({ loading: true })

            userjs.updateUser(values, (json) => {
                if (json.success) {
                    // console.log('----- success -----' + json.success)
                    notification.success({
                        message: `修改用户 ${values.displayName} 成功!`,
                        description: '新权限在用户重新登录后生效！'
                    })
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
            <Form style={{ background: 'white', padding: '15px' }}>

                <Item
                    {...formItemLayout}
                    label="登录名">
                    <Input disabled value={this.state.data.loginName} placeholder="登录名" />
                </Item>

                <Item
                    {...formItemLayout}
                    label="昵称"
                    hasFeedback>
                    {getFieldDecorator('displayName', {
                        rules: [
                            { required: true, message: '请填写昵称' },
                            { max: 50, message: '不能超过50字' },
                        ],
                        initialValue: this.state.data.displayName
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
                        ],
                        initialValue: this.state.data.telphone
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

UserInfo = create()(UserInfo)

export default UserInfo
