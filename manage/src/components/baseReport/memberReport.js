import assign from 'lodash.assign'
import React from 'react'
import { Form, Input, Table, Button } from 'antd'

import tools from '../../utils/tools'

const FormItem = Form.Item;

class Page extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            datas: [],
            loading: false
        }
    }

    componentWillMount() {
        this.getMemberList()
    }

    getMemberList() {
        this.props.form.validateFields((err, values) => {
            tools.post('/member/getMemberList', (json) => {
                if (json.success) {
                    this.setState({ datas: json.success, loading: false })
                } else {
                    this.setState({ loading: false })
                }
            }, { mobile: values.mobile, province: values.province, city: values.city })
        })
    }

    render() {
        const dataSource = this.state.datas.map((data, index) => {
            return assign({}, data, {
                key: index,
                index: index + 1
            })
        })

        const columns = [{
            title: '序号',
            dataIndex: 'index',
            key: 'index'
        }, {
            title: '手机号码',
            dataIndex: 'mobile',
            key: 'mobile',
        }, {
            title: '所属省份',
            dataIndex: 'province',
            key: 'province',
        }, {
            title: '所属城市',
            dataIndex: 'city',
            key: 'city',
        }, {
            title: '注册时间',
            dataIndex: 'createdAt',
            key: 'createdAt',
        }]

        const { getFieldDecorator } = this.props.form
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        }

        return (
            <div>
                <div className="card searchForm">
                    <Form layout="inline">
                        <FormItem
                            {...formItemLayout}
                            label="手机号码"
                        >
                            {getFieldDecorator('mobile')(
                                <Input placeholder="游客手机号码" />
                            )}
                        </FormItem>

                        <FormItem
                            {...formItemLayout}
                            label="省份"
                        >
                            {getFieldDecorator('province')(
                                <Input placeholder="游客所属省份" />
                            )}
                        </FormItem>

                        <FormItem
                            {...formItemLayout}
                            label="城市"
                        >
                            {getFieldDecorator('city')(
                                <Input placeholder="游客所属城市" />
                            )}
                        </FormItem>

                        <FormItem>
                            <Button
                                type="primary"
                                onClick={this.getMemberList.bind(this)}
                            >
                                查询
                            </Button>
                        </FormItem>
                    </Form>
                </div>

                <div className="card">
                    <Table
                        columns={columns}
                        dataSource={dataSource}
                        bordered
                        loading={this.state.loading}
                    />
                </div>
            </div>
        )
    }
}


Page = Form.create()(Page)

export default Page
