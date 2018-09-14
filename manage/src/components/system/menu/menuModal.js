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
            tools.post('/menu/getMenuById', (json) => {
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

                    tools.post('/menu/menuEdit', (json) => {
                        if (json.success) {
                            this.props.onOk();
                        } else {
                            message.error(json.error);
                        }
                    }, { name: values.name, id, menuLink: values.menuLink, comPath: values.comPath, icon: values.icon, sort: values.sort, menuType: values.menuType })
                } else {
                    tools.post('/menu/menuCreate', (json) => {
                        if (json.success) {
                            this.props.onOk();
                        } else {
                            message.error(json.error);
                        }
                    }, { name: values.name, parentId: id, menuLink: values.menuLink, comPath: values.comPath, icon: values.icon, sort: values.sort, menuType: values.menuType })
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
                    label={(
                        <span>
                            导航类型&nbsp;
                            <Tooltip title="导航栏目以系统左侧菜单栏目为体现，页面路由不会出现在菜单栏目中，仅使用在dashboard">
                                <Icon type="question-circle-o" />
                            </Tooltip>
                        </span>
                    )}
                >
                    {getFieldDecorator('menuType', {
                        initialValue: this.state.menuType,
                        rules: [{ required: true, message: '请输入栏目名称' }]
                    })(
                        <Select onChange={this.handleMenuTypeChange.bind(this)} >
                            <Option value="1">导航栏目</Option>
                            <Option value="2">页面路由</Option>
                        </Select>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="栏目名称"
                >
                    {getFieldDecorator('name', {
                        initialValue: this.state.data.name,
                        rules: [{ required: true, message: '请输入栏目名称' }]
                    })(
                        <Input placeholder="请输入栏目名称" />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="路由链接"
                >
                    {getFieldDecorator('menuLink', {
                        initialValue: this.state.data.menuLink,
                    })(
                        <Input placeholder="例如：/user/list" />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label={(
                        <span>
                            组件路径&nbsp;
                            <Tooltip title="只需填写components文件下的路径,例如 /user/userList.js(系统在处理路由时会自动将components这一级路径自动加入)">
                                <Icon type="question-circle-o" />
                            </Tooltip>
                        </span>
                    )}
                >
                    {getFieldDecorator('comPath', {
                        initialValue: this.state.data.comPath,
                    })(
                        <Input placeholder="例如 /user/userList.js (文件后缀必填)" />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="图标"
                >
                    {getFieldDecorator('icon', {
                        initialValue: this.state.data.icon,
                    })(
                        <Input disabled={this.state.menuType === '1' ? false : true} placeholder="请输入antd图标名称，建议一级栏目设置图标" />
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
                title={this.state.data.id ? '编辑栏目' : '新增栏目'}
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