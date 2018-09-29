import React, { Component } from 'react'
import { Input, Button, Form, Select, message } from 'antd'
import tools from '../../../utils/tools'

const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;

class baseView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: null
        }
    }

    componentDidMount() {
        tools.get(`/getMyInfo`, (json) => {
            if (json.success) {
                this.setState({
                    user: json.success
                })
            } else {
                message.error(json.error)
            }
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                const displayName = values.displayName
                const gender = values.gender
                const telphone = values.telphone
                const remark = values.remark

                tools.put(`/updateMyInfo`, (json) => {
                    if (json.success) {
                        message.success('更新成功')
                    } else {
                        message.error(json.error)
                    }
                }, { displayName, gender, telphone, remark });
            }
        });
    }

    render() {

        const { getFieldDecorator } = this.props.form;

        return (
            this.state.user ? (
                <div style={{ width: '250px', marginTop: '35px' }}>
                    <Form layout={'vertical'} onSubmit={this.handleSubmit.bind(this)}>
                        <FormItem
                            label="登录名"
                        >
                            {getFieldDecorator('loginName', {
                                initialValue: this.state.user.loginName,
                            })(
                                <Input disabled />
                            )}
                        </FormItem>

                        <FormItem
                            label="昵称"
                        >
                            {getFieldDecorator('displayName', {
                                initialValue: this.state.user.displayName,
                            })(
                                <Input placeholder="昵称" />
                            )}
                        </FormItem>

                        <FormItem
                            label="性别"
                        >
                            {getFieldDecorator('gender', {
                                initialValue: this.state.user.gender,
                            })(
                                <Select placeholder="性别">
                                    <Option value="1">男</Option>
                                    <Option value="0">女</Option>
                                </Select>
                            )}
                        </FormItem>

                        <FormItem
                            label="联系电话"
                        >
                            {getFieldDecorator('telphone', {
                                initialValue: this.state.user.telphone,
                            })(
                                <Input placeholder="联系电话" />
                            )}
                        </FormItem>

                        <FormItem
                            label="个人简介"
                        >
                            {getFieldDecorator('remark', {
                                initialValue: this.state.user.remark,
                            })(
                                <TextArea placeholder="个人简介" />
                            )}
                        </FormItem>

                        <FormItem >
                            <Button type="primary" htmlType="submit" size="large">更新</Button>
                        </FormItem>
                    </Form>
                </div>
            ) : null
        )
    }
}

export default Form.create()(baseView)