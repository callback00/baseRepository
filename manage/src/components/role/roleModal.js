import React from 'react'
import { message, Modal, Form, Input } from 'antd'
import tools from '../../utils/tools'

const FormItem = Form.Item;
const { TextArea } = Input;

message.config({
    top: 200,
});

class page extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
        };
    }

    componentDidMount() {
        if (this.props.roleId) {
            tools.post('/role/getRoleById', (json) => {
                if (json.success) {
                    this.setState({ data: json.success });
                } else {
                    message.error(json.error);
                }
            }, { id: parseInt(this.props.roleId) })
        }
    }

    handleOk(event) {

        event.preventDefault();

        const id = this.props.roleId;

        this.props.form.validateFields((err, values) => {
            if (!err) {
                if (this.state.data && this.state.data.id) {

                    tools.post('/role/roleEdit', (json) => {
                        if (json.success) {
                            this.props.onOk();
                        } else {
                            message.error(json.error);
                        }
                    }, { name: values.name, remark: values.remark, id })
                } else {
                    tools.post('/role/roleCreate', (json) => {
                        if (json.success) {
                            this.props.onOk();
                        } else {
                            message.error(json.error);
                        }
                    }, { name: values.name, remark: values.remark })
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
            wrapperCol: { span: 18 },
        };
        const { getFieldDecorator } = this.props.form
        return (
            <Form>
                <FormItem
                    {...formItemLayout}
                    label="角色名称"
                >
                    {getFieldDecorator('name', {
                        initialValue: this.state.data.name,
                        rules: [{ required: true, message: '请输入角色名称' }]
                    })(
                        <Input placeholder="请输入角色名称" />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="角色描述"
                >
                    {getFieldDecorator('remark', {
                        initialValue: this.state.data.remark,
                    })(
                        <TextArea rows={3} placeholder="角色功能描述" />
                    )}
                </FormItem>
            </Form>
        )
    }

    render() {
        return (
            <Modal
                title={this.state.data.id ? '编辑角色' : '新增角色'}
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

page = Form.create()(page)

export default page