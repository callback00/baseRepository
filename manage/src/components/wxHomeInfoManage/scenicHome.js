import assign from 'lodash.assign'
import React from 'react'
import { Form, Input, Table, Button, Upload, Icon, message } from 'antd'

import tools from '../../utils/tools'

const FormItem = Form.Item;

class Page extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    componentWillMount() {

    }

    beforeUpload(file) {
        const isImage = file.type === 'image/jpeg' || file.type === 'image/gif' || file.type === 'image/jpg' || file.type === 'image/png';
        if (!isImage) {
            message.error('上传出错，只支持图片上传。');
        }

        return isImage
    }

    handleSubmit() {

    }

    render() {
        const tokenString = tools.getToken()

        const props = {
            action: 'http://localhost:8081/api/tempFile/baseUpload',
            headers: {
                Authorization: `Basic ${tokenString}`,
            },
            multiple: true,
            beforeUpload: this.beforeUpload.bind(this),
            onChange(info) {
                if (info.file.status !== 'uploading') {
                    console.log(info.file, info.fileList);
                }
                if (info.file.status === 'done') {

                    const tepmFilse = this.state.tepmFilse;
                    tepmFilse.push(info.file)
                    this.setState({
                        tepmFilse
                    });

                    message.success(`${info.file.name} file uploaded successfully`);
                } else if (info.file.status === 'error') {
                    message.error(`${info.file.name} file upload failed.`);
                }
            },
        };

        return (
            <div>
                <div className="card searchForm">
                    <Form layout="inline">
                        <FormItem>
                            <Upload {...props}>
                                <Button>
                                    <Icon type="upload" /> Click to Upload
                                </Button>
                            </Upload>

                            <Button onClick={this.handleSubmit.bind(this)} >
                                正式提交
                            </Button>
                        </FormItem>
                    </Form>
                </div>
            </div>
        )
    }
}


Page = Form.create()(Page)

export default Page
