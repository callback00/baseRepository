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
            menuType: '1'
        };
    }

    componentDidMount() {
        if (this.props.option === 'edit') {
            tools.post('/apiManage/getApiById', (json) => {
                if (json.success) {
                    this.setState({ data: json.success });
                } else {
                    message.error(json.error);
                }
            }, { id: parseInt(this.props.id) })
        }
    }

    handleMenuTypeChange(value) {
        this.setState({
            menuType: value
        })
    }

    handleOk(event) {

        event.preventDefault();

        const id = this.props.id;

        this.props.form.validateFields((err, values) => {
            if (!err) {
                if (this.state.data && this.state.data.id) {

                    tools.post('/apiManage/apiEdit', (json) => {
                        if (json.success) {
                            this.props.onOk();
                        } else {
                            message.error(json.error);
                        }
                    }, { name: values.name, id, url: values.url, sort: values.sort })
                } else {
                    tools.post('/apiManage/apiCreate', (json) => {
                        if (json.success) {
                            this.props.onOk();
                        } else {
                            message.error(json.error);
                        }
                    }, { name: values.name, parentId: id, url: values.url, sort: values.sort })
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
                    label="api权限名称"
                >
                    {getFieldDecorator('name', {
                        initialValue: this.state.data.name,
                        rules: [{ required: true, message: 'api权限名称' }]
                    })(
                        <Input placeholder="api权限名称,例如：新增" />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="路由链接"
                >
                    {getFieldDecorator('url', {
                        initialValue: this.state.data.url,
                    })(
                        <Input placeholder="填写url路由，例如：/user/create" />
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