const { trim } = require('lodash')

const file = require('../../common/file')

module.exports = {

    /**
    * 临时文件夹只做大类校验，单独的文件类型校验由前端自行处理，将临时文件夹复制的正式文件夹时可由后台进行精确控制 
    * 如果不需要特殊处理逻辑，上传文件均可先调用该接口先将文件保存在临时文件夹中。
    * 接口返回临时文件的路径和原始文件名。
    * antd 上传的文件都是单个上传的。
    * @param req.files.file  前端上传的文件，connect-multiparty组件已自动将文件流写入到临时文件夹中。
    */
    baseUpload: (req, res) => {
        const tempFiles = req.files.file;

        // 将临时文件基本信息返回给前端
        res.status(200).json({ success: { tempFiles } });
    },
}
