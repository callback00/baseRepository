import assign from 'lodash.assign'
import React from 'react'
import { Form, Row, Col, Input, Table, Button, DatePicker } from 'antd'

import tools from '../../utils/tools'

const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;

class Page extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            datas: [],
            loading: false
        }
    }

    componentWillMount() {
        this.getAuditLogList()
    }

    getAuditLogList() {
        this.setState({
            loading: true
        })
        this.props.form.validateFields((err, values) => {

            let startTime = '';
            let endTime = '';
            if (values.createdAt) {
                startTime = values.createdAt[0].format('YYYY-MM-DD') + ' 00:00:00'
                endTime = values.createdAt[1].format('YYYY-MM-DD') + ' 23:59:59'
            }

            const searchParam = {
                auditPhone: values.auditPhone,
                auditName: values.auditName,
                workAreaName: values.workAreaName,
                memberPhone: values.memberPhone,
                province: values.province,
                city: values.city,
                startTime,
                endTime
            }

            tools.post('/auditLog/getAuditLogList', (json) => {
                if (json.success) {
                    this.setState({ datas: json.success, loading: false })
                } else {
                    this.setState({ loading: false })
                }
            }, searchParam)
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
            title: '管理员号码',
            dataIndex: 'auditPhone',
            key: 'auditPhone',
        }, {
            title: '管理员姓名',
            dataIndex: 'auditName',
            key: 'auditName',
        }, {
            title: '景区区域',
            dataIndex: 'workAreaName',
            key: 'workAreaName',
        }, {
            title: '旅客号码',
            dataIndex: 'memberPhone',
            key: 'memberPhone',
        }, {
            title: '所属省份',
            dataIndex: 'province',
            key: 'province',
        }, {
            title: '所属城市',
            dataIndex: 'city',
            key: 'city',
        }, {
            title: '核销时间',
            dataIndex: 'createdAt',
            key: 'createdAt',
        }]

        const { getFieldDecorator } = this.props.form
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 },
        }

        return (
            <div>
                <div className="card searchForm">
                    <Form layout="inline">
                        <Row gutter={24}>
                            <Col span={8} >
                                <FormItem
                                    {...formItemLayout}
                                    label="管理员号码"
                                    style={{ width: '100%' }}
                                >
                                    {getFieldDecorator('auditPhone')(
                                        <Input placeholder="管理员号码" />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8} >
                                <FormItem
                                    {...formItemLayout}
                                    label="景区区域"
                                    style={{ width: '100%' }}
                                >
                                    {getFieldDecorator('workAreaName')(
                                        <Input placeholder="景区区域" />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8} >
                                <FormItem
                                    {...formItemLayout}
                                    label="旅客号码"
                                    style={{ width: '100%' }}
                                >
                                    {getFieldDecorator('memberPhone')(
                                        <Input placeholder="旅客号码" />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>


                        <Row gutter={24}>
                            <Col span={8} >
                                <FormItem
                                    {...formItemLayout}
                                    label="省份"
                                    style={{ width: '100%' }}
                                >
                                    {getFieldDecorator('province')(
                                        <Input placeholder="旅客所属省份" />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8} >
                                <FormItem
                                    {...formItemLayout}
                                    label="城市"
                                    style={{ width: '100%' }}
                                >
                                    {getFieldDecorator('city')(
                                        <Input placeholder="旅客所属城市" />
                                    )}
                                </FormItem>
                            </Col>

                            <Col span={8} >
                                <FormItem
                                    {...formItemLayout}
                                    label="核销时间"
                                    style={{ width: '100%' }}
                                >
                                    {getFieldDecorator('createdAt')(
                                        <RangePicker />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                    <div style={{ textAlign: 'right' }} >
                        <Button
                            type="primary"
                            onClick={this.getAuditLogList.bind(this)}
                            style={{ position: 'relative', right: '0' }}
                        >
                            查询
                        </Button>
                    </div>

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
