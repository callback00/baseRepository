import React from 'react'
import { message, Button, Modal, Form, Input, InputNumber, Tooltip, Icon } from 'antd'
import tools from '../../utils/tools'

const FormItem = Form.Item
message.config({
    top: 200,
});

class page extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            auditer: {}
        };
    }

    componentDidMount() {
        if (this.props.option === 'edit') {
            tools.post('/workAreaAuditer/getAuditerById', (json) => {
                if (json.success) {
                    this.setState({ auditer: json.success });
                } else {
                    message.error(json.error);
                }
            }, { id: parseInt(this.props.id) })
        }
    }

    handleOk(event) {

        event.preventDefault();

        const id = this.props.id;

        this.props.form.validateFields((err, values) => {
            if (!err) {
                if (this.state.auditer && this.state.auditer.id) {

                    tools.post('/workAreaAuditer/workAreaAuditerEdit', (json) => {
                        if (json.success) {
                            this.props.onOk();
                        } else {
                            message.error(json.error);
                        }
                    }, { auditName: values.auditName, id, sort: values.sort })
                } else {
                    tools.post('/workAreaAuditer/workAreaAuditerCreate', (json) => {
                        if (json.success) {
                            this.props.onOk();
                        } else {
                            message.error(json.error);
                        }
                    }, { auditPhone: values.auditPhone, auditName: values.auditName, waid: parseInt(this.props.waid), sort: values.sort })
                }
            }
        })

    }

    handleCancel() {
        this.props.onCancel()
    }

    renderModal() {

        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 16 },
        };
        const { getFieldDecorator } = this.props.form
        return (
            <Form>
                <FormItem
                    {...formItemLayout}
                    label="管理区域"
                >
                    <Input value={this.props.workAreaName} disabled />
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="管理员手机"
                >
                    {getFieldDecorator('auditPhone', {
                        initialValue: this.state.auditer.auditPhone,
                        rules: [{ required: true, message: '请输入管理员手机' }]
                    })(
                        <Input placeholder="请输入管理员手机" disabled={this.props.option === 'edit' ? true : false} />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="管理员姓名"
                >
                    {getFieldDecorator('auditName', {
                        initialValue: this.state.auditer.auditName,
                        rules: [{ required: true, message: '请输入管理员姓名' }]
                    })(
                        <Input placeholder="请输入管理员姓名" />
                    )}
                </FormItem>
            </Form>
        )
    }

    render() {
        return (
            <Modal
                title={this.state.auditer.id ? '编辑区域' : '新增区域'}
                visible={this.props.visible}
                key={this.props.modalKey}
                onOk={this.handleOk.bind(this)}
                onCancel={this.handleCancel.bind(this)}
            >
                {this.renderModal()}
            </Modal>
        )
    }
}

page = Form.create()(page)

export default page