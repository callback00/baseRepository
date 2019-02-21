import React from 'react'
import { message, Button, Modal, Form, Input, Collapse, Tooltip, Icon, Select } from 'antd'
import SyntaxHighlighter from 'react-syntax-highlighter/prism';
import tools from '../../../utils/tools'

const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;
const Panel = Collapse.Panel;
message.config({
    top: 200,
});

class page extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
            templetParamKeys: [],
        };
    }

    componentDidMount() {
        if (this.props.id) {
            tools.post('/noticeManage/getNoticeById', (json) => {
                // 数据库调用的是findone，找不到数据时返回的success就是null
                if (json.success) {
                    const paramArry = JSON.parse(json.success.templetParam)
                    this.setState({ data: json.success, templetParamKeys: paramArry });
                } else {
                    if (json.error) {
                        message.error(json.error);
                    } else {
                        message.error('数据不存在');
                    }
                }
            }, { id: parseInt(this.props.id) })
        }
    }

    valueOnChange(key) {
        console.log(1)
    }

    handleOk(event) {

        event.preventDefault();

        this.props.form.validateFields((err, values) => {
            if (!err) {
                const noticeTitle = values.noticeTitle;
                const contact = values.contact;

                const temp = { ...values }
                delete temp.noticeTitle
                delete temp.contact
                delete temp.noticeType
                delete temp.noticeCode
                delete temp.noticeTemplet

                // 传入的参数个数
                const noticeParamData = {
                    noticeTitle,
                    contact,

                    // 此对象保存消息模板参数的键、值
                    templetParam: {
                        ...temp
                    }
                }

                tools.post('/noticeManage/sendTemplateNoticeDetail', (json) => {
                    if (json.success) {
                        message.success('发送成功')
                        this.props.onOk();
                    } else {
                        message.error(json.error);
                    }
                }, { noticeParamData, noticeCode: this.state.data.noticeCode, noticeType: this.state.data.noticeType })
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

        const { getFieldDecorator } = this.props.form;

        const keys = this.state.templetParamKeys;
        const templetParamFormItems = keys.map((k, index) => {
            return (
                <FormItem
                    {...formItemLayout}
                    label={k}
                    required={false}
                    key={index}
                >
                    {getFieldDecorator(k)(
                        <Input placeholder="请输入值" onChange={this.valueOnChange.bind(this, k)} style={{ width: '60%', marginRight: 8 }} />
                    )}
                </FormItem>
            );
        });

        return (
            <div className="send-notice-modal">
                <div className="content">
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
                                <Select disabled>
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
                                <Input disabled placeholder="请输入模板编码" />
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
                                <TextArea rows={5} disabled placeholder={this.props.option === 'create' ? "请参照下面的例子填入模板内容" : '请填入消息模板内容'} />
                            )}
                        </FormItem>

                        {
                            this.state.data.noticeType === '1' ?
                                <FormItem
                                    {...formItemLayout}
                                    label={'消息标题'}
                                >
                                    {getFieldDecorator('noticeTitle')(
                                        <Input placeholder="请输入值" />
                                    )}
                                </FormItem> : null
                        }
                        {
                            <FormItem
                                {...formItemLayout}
                                label={this.state.data.noticeType === '2' ? '手机号码' : '用户id'}
                            >
                                {getFieldDecorator('contact')(
                                    <Input placeholder={this.state.data.noticeType === '2' ? '请输入接收该信息的手机号码' : '请输入接收该消息的用户id'} />
                                )}
                            </FormItem>
                        }
                        {
                            templetParamFormItems
                        }
                    </Form>
                </div>
                <div className="view-code">
                    <Collapse>
                        <Panel header="查看发送代码" key="1">
                            <SyntaxHighlighter language='jsx'>
                                {
                                    `
// 此段代码为发送按钮的核心代码
this.props.form.validateFields((err, values) => {
    if (!err) {
        const noticeTitle = values.noticeTitle;
        const contact = values.contact;

        const temp = { ...values }
        delete temp.noticeTitle //消息标题，只有系统消息才需要该参数
        delete temp.contact // 短信消息填入手机号码，系统消息填入用户id
        delete temp.noticeType
        delete temp.noticeCode
        delete temp.noticeTemplet

        // 传入的参数格式
        const noticeParamData = {
            noticeTitle,
            contact,

            // 此对象保存消息模板参数的键、值
            templetParam: {
                ...temp
            }
        }

        tools.post('/noticeManage/sendTemplateNoticeDetail', (json) => {
            if (json.success) {
                this.props.onOk();
            } else {
                message.error(json.error);
            }
        }, { 
            noticeParamData, 
            noticeCode: this.state.data.noticeCode, 
            noticeType: this.state.data.noticeType
        })
    }
})
                        `
                                }
                            </SyntaxHighlighter>
                        </Panel>

                    </Collapse>
                </div>
            </div>
        )
    }

    render() {
        return (
            <Modal
                title={'消息测试'}
                width={800}
                visible={this.props.visible}
                key={this.props.modalKey}
                onOk={this.handleOk.bind(this)}
                okText="发送"
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