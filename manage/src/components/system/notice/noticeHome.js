import React from 'react'
import { Row, Col, Card, Icon, Popconfirm, Button, message } from 'antd'

import tools from '../../../utils/tools'

import NoticeModal from './noticeModal'
import SendNoticeModal from './sendNoticeModal'

const { Meta } = Card

class Page extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            visible: false,
            modalKey: 0,

            sendModalVisible: false,
            sendModalKey: 0,
        }
    }

    componentDidMount() {
        this.search();
    }

    search() {
        tools.post('/noticeManage/getNoticeList', (json) => {
            if (json.success) {
                this.setState({ data: json.success, loading: false });
            } else {
                this.setState({ loading: false });
            }
        })
    }

    showModalHandle(option, id) {
        const modalKey = this.state.modalKey + 1;
        this.setState({
            visible: true,
            modalKey,
            option,
            editId: id
        });
    }

    handleSaveOk() {
        this.setState({
            visible: false
        });
        this.search();
        message.success('操作成功');
    }

    handleSaveCancel() {
        this.setState({
            visible: false
        });
    }

    // 暂时不需要处理
    handleSendOk() {

    }

    handleSendCancel() {
        this.setState({
            sendModalVisible: false
        });
    }

    showSendModalHandle(id) {
        const sendModalKey = this.state.sendModalKey + 1;
        this.setState({
            sendModalVisible: true,
            sendModalKey,
            editId: id
        });
    }

    handelDelete(id) {
        tools.del('/noticeManage/noticeDelete', (json) => {
            if (json.success) {
                message.success(json.success)
                this.search();
            } else {
                message.error(json.error)
            }
        }, { id })
    }

    renderMessageItem() {
        const List = this.state.data.map((item) => {
            return (
                <Col key={item.id} xs={24} sm={24} md={24} lg={12} xl={8}>
                    <div className="message-card" >
                        <Card
                            style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}
                            actions={[
                                <span onClick={this.showModalHandle.bind(this, 'edit', item.id)} >编辑</span>,
                                <span >
                                    <Popconfirm placement="topLeft" title={'你确定要删除该模板吗'} onConfirm={this.handelDelete.bind(this, item.id)} okText="确定" cancelText="取消">
                                        <span>删除</span>
                                    </Popconfirm>
                                </span>,
                                <span onClick={this.showSendModalHandle.bind(this, item.id)}>测试</span>]}
                        >
                            <Meta
                                avatar={<Icon type={item.noticeType === '1' ? "bell" : 'mail'} style={{ fontSize: '45px', color: '#08c' }} />}
                                title={item.noticeName}
                                description={
                                    <p className="ellipsis">
                                        <style>
                                            {
                                                `.ellipsis{-webkit-line-clamp:3;-webkit-box-orient: vertical;}`
                                            }
                                        </style>

                                        {
                                            item.noticeTemplet
                                        }
                                    </p>
                                }
                            />
                        </Card>
                    </div>
                </Col>
            )
        })

        return List
    }

    render() {
        return (
            <div>
                <div className="page-description" >
                    <h1 style={{ fontSize: '20px' }} >
                        消息管理
                    </h1>
                    <p>
                        功能示意：此处仅维护的消息模板，需要用到消息模板需通过数据库获取。
                    </p>
                </div>

                <div style={{ marginTop: '16px' }} >
                    <Row type='flex'>
                        <Col xs={24} sm={24} md={24} lg={12} xl={8}>
                            <div className="message-card" >
                                <Button onClick={this.showModalHandle.bind(this, 'create')} className="message-add" type="dashed">
                                    <Icon type="plus" /> 新增模板
                            </Button>
                            </div>
                        </Col>
                        {
                            this.renderMessageItem()
                        }
                    </Row>
                </div>

                <NoticeModal
                    visible={this.state.visible}
                    id={this.state.editId ? this.state.editId : 0}
                    option={this.state.option}
                    key={this.state.modalKey}
                    modalKey={this.state.modalKey}
                    onOk={this.handleSaveOk.bind(this)}
                    onCancel={this.handleSaveCancel.bind(this)}
                />

                <SendNoticeModal
                    visible={this.state.sendModalVisible}
                    id={this.state.editId}
                    key={`sendModal-${this.state.sendModalKey}`}
                    modalKey={this.state.sendModalKey}
                    onOk={this.handleSendOk.bind(this)}
                    onCancel={this.handleSendCancel.bind(this)}
                />
            </div>
        )
    }
}

export default Page

