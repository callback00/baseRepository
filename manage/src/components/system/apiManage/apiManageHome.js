import React from 'react'
import { Table, Button, message, Modal, Alert } from 'antd'

import tools from '../../../utils/tools'
import ApiManageModal from './apiManageModal'

message.config({
    top: 200,
});

const confirm = Modal.confirm;


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
        this.getTreeData();
    }

    getTreeData() {
        this.setState({
            loading: true
        });

        tools.get('/apiManage/getApiTree', (json) => {
            if (json.success) {
                this.setState({ data: json.success, loading: false });
            } else {
                message.error(json.error);
                this.setState({ loading: false });
            }
        })
    }

    showApiModalHandle(option) {

        if (option === 'edit' && !this.state.selectNode) {
            message.error('请选择要编辑的导航栏目');
        } else {
            const modalKey = this.state.modalKey + 1;
            this.setState({
                visible: true,
                modalKey,
                option
            });
        }
    }

    deleteConfirm() {
        if (!this.state.selectNode) {
            message.error('请选择删除的导航栏目');
            return;
        }

        if (this.state.selectNode.children && this.state.selectNode.children.length > 0) {
            message.error('请先删除该层的子节点');
            return;
        }

        const handelDelete = this.handelDelete.bind(this)
        confirm({
            title: '你确定要删除该记录吗',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                handelDelete();
            },
            onCancel() {
            },
        });
    }

    handelDelete() {
        tools.del('/apiManage/apiDelete', (json) => {
            if (json.success) {
                message.success(json.success);
                this.getTreeData();
            } else {
                message.error(json.error);
            }
        }, { idArry: [this.state.selectNode.id] })
    }

    onRowClick(record, index) {
        if (this.state.selectNode && this.state.selectNode.id === record.id) {
            this.setState({
                selectNode: null
            });
        } else {
            this.setState({
                selectNode: record
            });
        }
    }

    handleSaveOk() {
        this.setState({
            visible: false
        });

        this.getTreeData();

        message.success('操作成功');
    }

    handleSaveCancel() {
        this.setState({
            visible: false
        });
    }

    renderTableHeader() {
        return (
            <div>
                <button className='btn-add' onClick={this.showApiModalHandle.bind(this, 'create')}>新增</button>
                <button className='btn-edit' style={{ marginLeft: '20px' }} onClick={this.showApiModalHandle.bind(this, 'edit')}>编辑</button>
                <button className='btn-delete' style={{ marginLeft: '20px' }} onClick={this.deleteConfirm.bind(this)}>删除</button>
            </div>
        )
    }

    tableOnRow(record, index) {

        const custStyle = {};

        // 设置表格斑马纹
        if (this.state.selectNode && this.state.selectNode.id === record.id) {
            custStyle.background = '#2db7f5'
        } else {
            if (record.parentId === 0) {
                if (index % 2 === 0) {
                    custStyle.background = '#fff'
                } else {
                    custStyle.background = '#f5f7f9'
                }
            } else {
                custStyle.background = '#fff'
            }
        }
        return ({
            onClick: this.onRowClick.bind(this, record, index),
            // 修改命名处理hover
            className: (this.state.selectNode && this.state.selectNode.id) === record.id ? 'coustom-select-active' : '',
            style: { background: custStyle.background },
        })

    }

    render() {
        const dataSource = this.state.data

        const columns = [{
            title: 'api权限名称',
            dataIndex: 'name',
            key: 'name',
        }, {
            title: '路由链接',
            dataIndex: 'url',
            key: 'url',
        }];

        return (
            <div className="apiManageHome">

                <Alert
                    message="操作建议"
                    description={
                        <div>
                            <p>1、api权限的层级设置与菜单没有必然联系，但最好还是能与menu的相对应，大部分api权限是相对于界面的。</p>
                            <p>2、此处不需要维护所有的api，只需维护需要验证权限的api</p>
                            <p>3、后台api需加上权限校验中间件，中间件根据此表的内容判断路由是否需要权限校验</p>
                        </div>
                    }
                    type="info"
                    showIcon
                />

                <div style={{ marginTop: '15px' }} className="card">
                    <Table
                        rowKey="id"
                        title={this.renderTableHeader.bind(this)}
                        columns={columns}
                        dataSource={dataSource}
                        bordered
                        loading={this.state.loading}
                        size="small"
                        style={{ minHeight: '150px' }}
                        pagination={false}
                        stripe

                        onRow={this.tableOnRow.bind(this)}
                    />
                </div>

                <ApiManageModal
                    visible={this.state.visible}
                    id={this.state.selectNode ? this.state.selectNode.id : 0}
                    option={this.state.option}
                    key={this.state.modalKey}
                    modalKey={this.state.modalKey}
                    onOk={this.handleSaveOk.bind(this)}
                    onCancel={this.handleSaveCancel.bind(this)}
                />
            </div>
        )
    }
}

export default Page
