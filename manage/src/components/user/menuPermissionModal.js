import React from 'react'
import { Tree, message, Modal, Button } from 'antd'
import tools from '../../utils/tools'

import difference from 'lodash.difference'

const TreeNode = Tree.TreeNode;

message.config({
    top: 200,
});

class Page extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            treeData: [],

            expandedKeys: [],
            autoExpandParent: true,
            checkedKeys: [],
            selectedKeys: [],
            permissionKeys: [] // 用于记录原始数据

        }
    }

    componentWillMount() {
        if (this.props.userId) {
            this.getTreeData()
        }
    }

    getTreeData() {
        tools.post('/menuPermission/getMenuPermissionTree', (json) => {
            if (json.success) {
                const treeData = json.success.treeData;

                const permissionKeys = [];
                json.success.permissionList.forEach(item => {
                    permissionKeys.push(`${item.menuId}`)
                });

                this.setState({
                    treeData,
                    expandedKeys: permissionKeys,
                    checkedKeys: permissionKeys,
                    permissionKeys
                });
            } else {
                message.error(json.error);
            }
        }, { userId: this.props.userId })
    }

    handleOk() {
        const deleteKeyList = difference(this.state.permissionKeys, this.state.checkedKeys);
        const addKeyList = difference(this.state.checkedKeys, this.state.permissionKeys);
        tools.post('/menuPermission/permissionSave', (json) => {
            if (json.success) {
                message.success('更新成功');
                this.props.onOk();
            } else {
                message.error(json.error);
            }
        }, { userId: this.props.userId, addKeyList, deleteKeyList })
    }

    handleCancel() {
        this.props.onCancel();
    }

    onExpand(expandedKeys) {
        // if not set autoExpandParent to false, if children expanded, parent can not collapse.
        // or, you can remove all expanded children keys.
        this.setState({
            expandedKeys,
            autoExpandParent: false,
        });
    }

    onCheck(checkedKeys, e) {
        this.setState({ checkedKeys });
    }

    onSelect(selectedKeys, info) {
        this.setState({ selectedKeys });
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

    renderModal() {
        const treeData = this.state.treeData;
        return (
            <div className="auditer-content" style={{ maxHeight: '600px', overflowY: 'auto' }} >
                <Tree
                    checkable
                    onExpand={this.onExpand.bind(this)}
                    expandedKeys={this.state.expandedKeys}
                    autoExpandParent={this.state.autoExpandParent}
                    onCheck={this.onCheck.bind(this)}
                    checkedKeys={this.state.checkedKeys}
                    onSelect={this.onSelect.bind(this)}
                    selectedKeys={this.state.selectedKeys}
                >
                    {this.renderTree(treeData)}
                </Tree>
            </div>
        )
    }

    render() {
        return (
            <Modal
                title={`编辑菜单权限 (当前用户：${this.props.loginName})`}
                visible={this.props.visible}
                key={this.props.modalKey}
                // onOk={this.handleOk.bind(this)}
                onCancel={this.handleCancel.bind(this)}

                footer={[
                    <Button key="back" onClick={this.handleCancel.bind(this)}>关闭</Button>,
                    <Button key="submit" type="primary" onClick={this.handleOk.bind(this)}>
                        保存
                    </Button>,
                ]}
            >
                {this.renderModal()}
            </Modal>
        )
    }
}

export default Page
