const { assign, union } = require('lodash')

const file = require('../../common/file')

const redisUtility = require('../../common/redisUtility')
const memberOperate = require('../../operates/manage/memberOperate')

module.exports = {
    //获取会员列表
    createScenic: async (req, res) => {

        const baseFileInfoArry = this.req.baseFileInfoArry;

        const files = baseFileInfoArry.map((tempFileInfo) => {
            const tempFile = file.getFileByPath(tempFileInfo.path);
            if (tempFile) {
                return assign({}, tempFile, { originalFilename: tempFileInfo.originalFilename });
            } else {
                return null
            }
        }).filter((notNull) => {
            return notNull
        })

        // 将临时文件保存到正式文件目录下
        const saveFiles = await file.saveAs(files, ['scenic'], file.image(), '', true);

        if (saveFiles && saveFiles.length > 0) {
            // 删除临时文件夹的文件
            baseFileInfoArry.forEach(tempFileInfo => {
                file.remove(tempFileInfo.path)
            });
        }

        res.status(200).json({ success: '接收成功' });
    },
}
