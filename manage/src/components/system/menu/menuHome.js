import assign from 'lodash.assign'
import React from 'react'
import { Table, Button, message, Modal, Alert } from 'antd'

import tools from '../../../utils/tools'
import MenuModal from './menuModal'

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

        tools.get('/menu/getMenuTree', (json) => {
            if (json.success) {
                this.setState({ data: json.success, loading: false });
            } else {
                this.setState({ loading: false });
            }
        })
    }

    showMenuModalHandle(option) {

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
        tools.del('/menu/menuDelete', (json) => {
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
                <button className='btn-add' onClick={this.showMenuModalHandle.bind(this, 'create')}>新增</button>
                <button className='btn-edit' style={{ marginLeft: '20px' }} onClick={this.showMenuModalHandle.bind(this, 'edit')}>编辑</button>
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
            title: '栏目名称',
            dataIndex: 'name',
            key: 'name',
        }, {
            title: '路由链接',
            dataIndex: 'menuLink',
            key: 'menuLink',
        }, {
            title: '图标',
            dataIndex: 'icon',
            key: 'icon',
        }];

        return (
            <div className="menuHome">

                <Alert
                    message="操作建议"
                    description={
                        <div>
                            <p>1、所有通过url访问的页面均可在此处配置</p>
                            <p>2、路由类型分为两种类型：1、导航路由(出现在系统左侧菜单栏目中) 2、页面路由(不会出现在左侧菜单栏目中)</p>
                            <p>3、个人中心的栏目请在config文件夹内配置。</p>
                        </div>
                    }
                    type="info"
                    showIcon
                />

                <div className="card">
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

                <MenuModal
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
