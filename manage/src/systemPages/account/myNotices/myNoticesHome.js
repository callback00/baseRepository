import assign from 'lodash.assign'
import React from 'react'
import { Table, Button, message, Modal, Alert } from 'antd'

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

    render() {
        const dataSource = this.state.data

        const columns = [{
            title: '标题',
            dataIndex: 'noticeTitle',
            key: 'noticeTitle',
        }, {
            title: '消息内容',
            dataIndex: 'noticeContent',
            key: 'noticeContent',
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
                        // bordered
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
