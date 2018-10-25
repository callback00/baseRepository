import React from 'react'
import { message, Button, Modal, Form, Input, InputNumber, Tooltip, Icon, Select } from 'antd'
import tools from '../../../utils/tools'

const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;
message.config({
    top: 200,
});

class page extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
            templetParamKeys: [],

            templetParamOldKeys: [] // 用于初始值时使用
        };
    }

    componentDidMount() {
        if (this.props.option === 'edit') {
            tools.post('/noticeManage/getNoticeById', (json) => {
                if (json.success) {
                    const paramArry = JSON.parse(json.success.templetParam)
                    this.setState({ data: json.success, templetParamKeys: paramArry, templetParamOldKeys: paramArry });
                } else {
                    message.error(json.error);
                }
            }, { id: parseInt(this.props.id) })
        }
    }

    addTempletParam() {
        const keys = this.state.templetParamKeys;

        keys.push('')
        this.setState({
            templetParamKeys: keys
        })
    }

    removeTempletParam() {
        console.log('removeTempletParam')
    }

    handleOk(event) {

        event.preventDefault();

        const id = this.props.id;

        this.props.form.validateFields((err, values) => {
            if (!err) {
                if (this.state.data && this.state.data.id) {

                    tools.post('/noticeManage/noticeEdit', (json) => {
                        if (json.success) {
                            this.props.onOk();
                        } else {
                            message.error(json.error);
                        }
                    }, { id, noticeCode: values.noticeCode, noticeName: values.noticeName, noticeType: values.noticeType, noticeIcon: values.noticeIcon, noticeTemplet: values.noticeTemplet, templetParam: values.templetParam })
                } else {
                    tools.post('/noticeManage/noticeCreate', (json) => {
                        if (json.success) {
                            this.props.onOk();
                        } else {
                            message.error(json.error);
                        }
                    }, { noticeCode: values.noticeCode, noticeName: values.noticeName, noticeType: values.noticeType, noticeIcon: values.noticeIcon, noticeTemplet: values.noticeTemplet, templetParam: values.templetParam })
                }
            }
        })

    }

    handleCancel() {
        this.props.onCancel()
    }

    renderModal() {
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 18 },
            },
        };
        const formItemLayoutWithOutLabel = {
            wrapperCol: {
                xs: { span: 24, offset: 0 },
                sm: { span: 18, offset: 6 },
            },
        };

        const { getFieldDecorator } = this.props.form;

        const keys = this.state.templetParamKeys;

        const oldKeys = this.state.templetParamOldKeys;
        const templetParamFormItems = keys.map((k, index) => {
            //初始值
            const initialValue = oldKeys.filter((item) => {
                return item === k
            })[0]
            return (
                <FormItem
                    {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                    label={index === 0 ? '模板参数' : ''}
                    required={false}
                    key={index}
                >
                    {getFieldDecorator(`templetParam[${index}]`, {
                        initialValue: initialValue ? initialValue : ''
                    })(
                        <Input placeholder="请输入参数名称" style={{ width: '60%', marginRight: 8 }} />
                    )}

                    <Icon
                        className="dynamic-delete-button"
                        type="minus-circle-o"
                        disabled={keys.length === 1}
                        onClick={() => this.remove(index)}
                    />
                </FormItem>
            );
        });

        return (
            <Form>
                <FormItem
                    {...formItemLayout}
                    label={(
                        <span>
                            消息模板&nbsp;
                            <Tooltip title="系统消息只会在页面中显示">
                                <Icon type="question-circle-o" />
                            </Tooltip>
                        </span>
                    )}
                >
                    {getFieldDecorator('noticeType', {
                        initialValue: this.state.data.noticeType ? this.state.data.noticeType : '1',
                        rules: [{ required: true, message: '请选择消息模板类型' }]
                    })(
                        <Select {...(this.props.option === 'edit' ? { disabled: true } : { disabled: false })}>
                            <Option value="1">系统消息</Option>
                            <Option value="2" disabled>短信消息(暂未实现)</Option>
                        </Select>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="模板编码"
                >
                    {getFieldDecorator('noticeCode', {
                        initialValue: this.state.data.noticeCode,
                        rules: [{ required: true, message: '请输入模板编码' }]
                    })(
                        <Input {...(this.props.option === 'edit' ? { disabled: true } : { disabled: false })} placeholder="请输入模板编码" />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="模板名称"
                >
                    {getFieldDecorator('noticeName', {
                        initialValue: this.state.data.noticeName,
                        rules: [{ required: true, message: '请输入模板名称' }]
                    })(
                        <Input placeholder="请输入模板名称" />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="消息图标"
                >
                    {getFieldDecorator('noticeIcon', {
                        initialValue: this.state.data.noticeIcon,
                    })(
                        <Input placeholder="现在仅支持antd的图标" />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label={(
                        <span>
                            消息模板
                        </span>
                    )}
                >
                    {getFieldDecorator('noticeTemplet', {
                        initialValue: this.state.data.noticeTemplet,
                        rules: [{ required: true, message: '请填入消息模板内容' }]
                    })(
                        <TextArea rows={5} placeholder={this.props.option === 'create' ? "请参照下面的例子填入模板内容" : '请填入消息模板内容'} />
                    )}
                </FormItem>
                {
                    this.props.option === 'create' ?
                        <FormItem
                            {...formItemLayout}
                            label={(
                                <span>
                                    模板例子
                                </span>
                            )}
                        >
                            <p style={{ color: '#008000' }}>{'您好，您在{shopName}商城购买{goodName}商品，付款金额{money}，请注意查收【测试】'}</p>
                            <p style={{ color: 'red' }}>{'注释1：{}的内容将会被参数替换为实际值'}</p>
                            <p style={{ color: 'red' }}>{'注释2：{}的内容需与模板参数相对应'}</p>
                        </FormItem> : null
                }
                {
                    templetParamFormItems
                }

                <FormItem
                    {...(keys.length > 0 ? formItemLayoutWithOutLabel : formItemLayout)}
                    label={keys.length > 0 ? '' : '模板参数'}
                >
                    <Button type="dashed" onClick={this.addTempletParam.bind(this)} style={{ width: '60%' }}>
                        <Icon type="plus" /> Add field
                    </Button>
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