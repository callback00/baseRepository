import assign from 'lodash.assign'
import React from 'react'
import { Table, Button, message, Modal, Alert, Tag } from 'antd'

import tools from '../../../utils/tools'

message.config({
    top: 200,
});



class Page extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            loading: false,

            visible: false,
            selectNode: null,

            modalKey: 0
        }
    }

    componentWillMount() {
        this.getData();
    }

    getData() {
        this.setState({
            loading: true
        });

        tools.post('/noticeDetail/getUserAllNoticeList', (json) => {
            if (json.success) {
                this.setState({ data: json.success.data, unReadMsgCount: json.success.unReadMsgCount, loading: false });
            } else {
                this.setState({ loading: false });
            }
        })
    }

    onReadClick(record) {
        if (!record.readFlag) {
            tools.post('/noticeDetail/updateReadFlag', (json) => {
                // if (json.success) {
                //     this.getData();
                // }

                const data = this.state.data;
                const item = data.filter((item) => item.id === record.id)[0]
                if (item) {
                    item.readFlag = true
                    this.setState({
                        data
                    })
                }
            }, { id: record.id })
        }
    }

    render() {
        const dataSource = this.state.data

        const columns = [{
            title: '',
            key: 'readFlag',
            dataIndex: 'readFlag',
            render: (text, record) => (
                <span>
                    <Tag onClick={this.onReadClick.bind(this, record)} color={record.readFlag ? 'green' : 'volcano'}>{record.readFlag ? '已读' : '未读'}</Tag>
                </span>
            ),
        }, {
            width:100,
            title: '发件人',
            dataIndex: 'senderName',
            key: 'senderName',
        }, {
            width:200,
            title: '标题',
            dataIndex: 'noticeTitle',
            key: 'noticeTitle',
        }, {
            title: '消息内容',
            dataIndex: 'noticeContent',
            key: 'noticeContent',
        }, {
            width:150,
            title: '时间',
            dataIndex: 'createdAt',
            key: 'createdAt',
        }];

        return (
            <div className="menuHome">

                <Alert
                    message={`当前消息共有 ${this.state.unReadMsgCount} 条未读`}
                    type="info"
                    showIcon
                />

                <div className="card">
                    <Table
                        rowKey="id"
                        columns={columns}
                        dataSource={dataSource}

                        loading={this.state.loading}
                        size="small"
                        style={{ minHeight: '150px', marginTop: '20px' }}
                        pagination={true}
                        stripe
                    />
                </div>
            </div>
        )
    }
}

export default Page
