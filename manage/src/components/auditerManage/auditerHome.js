import React from 'react'
import { Tree, message, Table, Button, Modal, Divider } from 'antd'
import tools from '../../utils/tools'

import WorkAreaModal from './workAreaModal'
import WorkAreaAuditerModal from './workAreaAuditerModal'

const TreeNode = Tree.TreeNode;
const confirm = Modal.confirm;

message.config({
    top: 200,
});

class AuditerHome extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            treeData: [],
            auditerData: [],

            areaModelVisible: false,
            auditerModelVisible: false,

            selectTreeKey: '',
            selectTreeName: '',

            modalKey: 0,

            option: '', // 用来标记弹出框是新增还是编辑
        }
    }

    componentWillMount() {
        this.getTreeData()
    }

    getTreeData() {
        tools.get('/workAreaAuditer/getWorkAreaTree', (json) => {
            if (json.success) {
                this.setState({ treeData: json.success })
            } else {
                message.error(json.error);
            }
        })
    }

    getAuditerData(waid) {
        if (waid !== '0') {
            tools.post('/workAreaAuditer/getAuditerListByAreaId', (json) => {
                if (json.success) {
                    this.setState({ auditerData: json.success })
                } else {
                    message.error(json.error);
                }
            }, { waid: parseInt(waid) })
        }
    }

    onSelect(selectedKeys, info) {

        if (selectedKeys.length > 0) {
            const key = selectedKeys[0];
            const selectTreeName = info.selectedNodes[0].props.title;
            this.setState({ selectTreeKey: key, selectTreeName })

            this.getAuditerData(key);
        } else {
            this.setState({
                selectTreeKey: '',
                selectTreeName: ''
            })
        }
    }

    showAreaModalHandle(option) {
        if (this.state.selectTreeKey === '') {
            message.error('请先选择节点后在操作');
        } else {

            if (this.state.selectTreeKey === '0' && option === 'edit') {
                message.error('根节点不可编辑');
                return;
            }
            const modalKey = this.state.modalKey + 1;
            this.setState({
                areaModelVisible: true,
                modalKey,
                option
            });
        }
    }

    showAreaDeleteConfirm() {

        const areaDeleteHandle = this.areaDeleteHandle.bind(this)
        confirm({
            title: '你确定要删除该记录吗',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                areaDeleteHandle();
            },
            onCancel() {
            },
        });
    }

    areaDeleteHandle() {

        if (this.state.selectTreeKey === '') {
            message.error('请先选择节点后在操作');
        } else {
            if (this.state.selectTreeKey === '0') {
                message.info('根节点无需删除');
            } else {
                tools.del('/workAreaAuditer/workAreaDelete', (json) => {
                    if (json.success) {
                        message.success(json.success)
                        this.getTreeData()
                    } else {
                        message.error(json.error)
                    }
                }, { id: this.state.selectTreeKey })
            }
        }
    }

    handleAreaOk() {
        this.setState({
            areaModelVisible: false
        });

        this.getTreeData();

        message.success('操作成功');
    }

    handleAreaCancel() {
        this.setState({
            areaModelVisible: false
        });
    }

    showAuditerModalHandle(option, id) {
        if (this.state.selectTreeKey === '') {
            message.error('请先选择节点后在操作');
        } else {

            if (this.state.selectTreeKey === '0' && option === 'create') {
                message.error('根节点处不可添加管理员');
                return;
            }
            const modalKey = this.state.modalKey + 1;
            this.setState({
                auditerModelVisible: true,
                modalKey,
                option,
                auditerId: id
            });
        }
    }

    handleAuditerOk() {
        this.setState({
            auditerModelVisible: false
        });

        this.getAuditerData(this.state.selectTreeKey);

        message.success('操作成功');
    }

    handleAuditerCancel() {
        this.setState({
            auditerModelVisible: false
        });
    }

    showAuditerDeleteConfirm(id) {

        const auditerDeleteHandle = this.auditerDeleteHandle.bind(this)
        confirm({
            title: '你确定要删除该记录吗',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                auditerDeleteHandle(id);
            },
            onCancel() {
            },
        });
    }

    auditerDeleteHandle(id) {
        tools.del('/workAreaAuditer/workAreaAuditerDelete', (json) => {
            if (json.success) {
                message.success(json.success)
                this.getAuditerData(this.state.selectTreeKey)
            } else {
                message.error(json.error)
            }
        }, { id })
    }

    renderTree(treeData) {
        const items = treeData.map((item) => {
            if (item.children) {
                return <TreeNode title={item.name} key={item.id}>{this.renderTree(item.children)}</TreeNode>;
            }
            return <TreeNode title={item.name} key={item.id} />
        })

        return items
    }

    renderTable() {

        const columns = [{
            title: '管理员姓名',
            dataIndex: 'auditName',
        }, {
            title: '电话',
            dataIndex: 'auditPhone',
        }, {
            title: '添加时间',
            dataIndex: 'createdAt',
            render: (text) => {
                return (
                    <span>{text.substr(0, 10)}</span>
                )
            }
        }, {
            title: '操作',
            key: 'action',
            render: (text, record) => (
                <span>
                    <a onClick={this.showAuditerModalHandle.bind(this, 'edit', record.id)} >
                        编辑
                    </a>
                    <Divider type="vertical" />
                    <a onClick={this.showAuditerDeleteConfirm.bind(this, record.id)} >
                        删除
                    </a>
                </span>
            ),
        }]

        return (
            <div style={{ paddingTop: '7px' }}>
                <Table
                    dataSource={this.state.auditerData}
                    columns={columns}
                    rowKey="id"
                />
            </div>
        )
    }

    render() {
        const treeData = this.state.treeData

        return (
            <div className="auditer-manage-wrapper">
                <div className="card auditer-manage-wrapper-left" >
                    <div className="auditer-header" >
                        <Button onClick={this.showAreaModalHandle.bind(this, 'create')} className="add" style={{ background: '#66CC99', color: 'white' }} icon='plus-circle-o'>新增</Button>
                        <Button onClick={this.showAreaModalHandle.bind(this, 'edit')} className="edit" type="primary" icon='edit'>编辑</Button>
                        <Button onClick={this.showAreaDeleteConfirm.bind(this)} className="delete" style={{ background: '#FF6666', color: 'white' }} icon='minus-circle-o'>删除</Button>
                    </div>
                    <div className="auditer-content" >
                        <Tree
                            defaultExpandedKeys={['0']}
                            onSelect={this.onSelect.bind(this)}
                        >
                            <TreeNode title="景区区域" key="0">
                                {this.renderTree(treeData)}
                            </TreeNode>
                        </Tree>
                    </div>
                </div>

                <div className="card auditer-manage-wrapper-right" >
                    <div className="auditer-header" >
                        核销管理员列表
                        <Button className="add" onClick={this.showAuditerModalHandle.bind(this, 'create')} style={{ background: '#66CC99', color: 'white' }} icon='plus-circle-o'>新增</Button>
                    </div>
                    <div className="auditer-content">
                        {this.renderTable()}
                    </div>
                </div>

                <WorkAreaModal
                    visible={this.state.areaModelVisible}
                    id={this.state.selectTreeKey}
                    option={this.state.option}
                    key={'area' + this.state.modalKey}
                    modalKey={this.state.modalKey}
                    parentName={this.state.selectTreeName}
                    onOk={this.handleAreaOk.bind(this)}
                    onCancel={this.handleAreaCancel.bind(this)}
                />

                <WorkAreaAuditerModal
                    visible={this.state.auditerModelVisible}
                    id={this.state.auditerId}
                    workAreaName={this.state.selectTreeName}
                    waid={this.state.selectTreeKey}
                    option={this.state.option}
                    key={'auditer' + this.state.modalKey}
                    modalKey={this.state.modalKey}
                    onOk={this.handleAuditerOk.bind(this)}
                    onCancel={this.handleAuditerCancel.bind(this)}
                />
            </div>
        )
    }
}

export default AuditerHome
