import React from 'react'
import { message, Button, Modal, Form, Input, InputNumber, Tooltip, Icon, Select } from 'antd'
import tools from '../../../utils/tools'

const FormItem = Form.Item;
const Option = Select.Option;
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
        if (this.props.option === 'edit') {
            tools.post('/company/getCompanyById', (json) => {
                if (json.success) {
                    this.setState({ data: json.success });
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
                if (this.state.data && this.state.data.id) {

                    tools.post('/company/companyEdit', (json) => {
                        if (json.success) {
                            this.props.onOk();
                        } else {
                            message.error(json.error);
                        }
                    }, { id, name: values.name, sort: values.sort, remark: values.remark })
                } else {
                    tools.post('/company/companyCreate', (json) => {
                        if (json.success) {
                            this.props.onOk();
                        } else {
                            message.error(json.error);
                        }
                    }, { name: values.name, parentId: id, sort: values.sort, remark: values.remark })
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
                    label="公司名称"
                >
                    {getFieldDecorator('name', {
                        initialValue: this.state.data.name,
                        rules: [{ required: true, message: '请输入公司名称' }]
                    })(
                        <Input placeholder="请输入公司名称" />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="备注"
                >
                    {getFieldDecorator('remark', {
                        initialValue: this.state.data.menuLink,
                    })(
                        <Input />
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
                        initialValue: this.state.data.sort ? this.state.data.sort : 1,
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
                title={this.state.data.id ? '编辑' : '新增'}
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