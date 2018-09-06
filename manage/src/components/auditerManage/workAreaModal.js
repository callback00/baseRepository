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
            workArea: {}
        };
    }

    componentDidMount() {
        if (this.props.option === 'edit') {
            tools.post('/workAreaAuditer/getWorkAreaById', (json) => {
                if (json.success) {
                    this.setState({ workArea: json.success });
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
                if (this.state.workArea && this.state.workArea.id) {

                    tools.post('/workAreaAuditer/workAreaEdit', (json) => {
                        if (json.success) {
                            this.props.onOk();
                        } else {
                            message.error(json.error);
                        }
                    }, { name: values.name, id, sort: values.sort })
                } else {
                    tools.post('/workAreaAuditer/workAreaCreate', (json) => {
                        if (json.success) {
                            this.props.onOk();
                        } else {
                            message.error(json.error);
                        }
                    }, { name: values.name, parentid: id, sort: values.sort })
                }
            }
        })

    }

    handleCancel() {
        this.props.onCancel()
    }

    renderModal() {

        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 16 },
        };
        const { getFieldDecorator } = this.props.form
        return (
            <Form>
                <FormItem
                    {...formItemLayout}
                    label="上级区域"
                >
                    <Input value={this.props.parentName} disabled />
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="区域名称"
                >
                    {getFieldDecorator('name', {
                        initialValue: this.state.workArea.name,
                        rules: [{ required: true, message: '请输入区域名称' }]
                    })(
                        <Input placeholder="请输入区域名称" />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label={(
                        <span>
                            排序&nbsp;
                            <Tooltip title="数字越小，排在越前面">
                                <Icon type="question-circle-o" />
                            </Tooltip>
                        </span>
                    )}
                >
                    {getFieldDecorator('sort', {
                        initialValue: this.state.workArea.sort ? this.state.workArea.sort : 1,
                    })(
                        <InputNumber min={1} max={99} />
                    )}
                </FormItem>
            </Form>
        )
    }

    render() {
        return (
            <Modal
                title={this.state.workArea.id ? '编辑区域' : '新增区域'}
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