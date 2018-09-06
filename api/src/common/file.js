const fs = require('fs')
const { assign, union } = require('lodash')
const path = require('path')

const seed = require('./seed')
const config = require('../../config/config')

const basePath = path.resolve(config.rootPath, '../file')

/**
 * 将文件复制到指定目录 (该方法未处理错误，后续需要补充)
 * @param file  connect-multiparty的文件对象
 * @param folder 文件夹，数组类型，按数组从头到尾创建文件夹
 * @param reName 如需重命名可赋值 
 * @param appendRandom bool值，为true时会在文件名后再加入一串6个字符的随机数 
 */
function copy(file, folder, reName = '', appendRandom = false) {
    mkdir(folder);

    const folderPath = folder instanceof Array ? folder.join('/') : String(folder);
    const extname = path.extname(file.originalFilename);
    let filename = path.basename(file.originalFilename, extname);

    if (reName) {
        filename = reName;
    }

    // 后缀是否需要随机数
    const random = appendRandom ? `_${seed.getSeed(6, true)}` : '';

    const originalFilename = `${filename}${random}${extname}`;

    const filePath = path.join('/', folderPath, originalFilename);
    const newPath = path.join(basePath, folderPath, originalFilename);

    const readStream = fs.createReadStream(file.path);

    // 管道流，用于处理大型文件的复制(对于新上传的文件，从临时文件夹中复制到指定文件夹内)
    readStream.pipe(fs.createWriteStream(newPath));

    return assign({}, file, { filePath, path: newPath, originalFilename, name: originalFilename });
}

/**
 * 创建文件目录
 * @param folder 文件夹，数组类型，按数组从头到尾创建文件夹
 */
function mkdir(folder) {
    if (folder instanceof Array) {

        // 注意reduce是有参数的，第二个参数为初始值
        folder.reduce((last, current) => {
            const currentPath = String(current)
            const folderPath = path.join(last, currentPath)
            if (!fs.existsSync(folderPath)) {
                fs.mkdirSync(folderPath)
            }

            return folderPath
        }, basePath)
    } else {
        const currentPath = String(folder)
        const folderPath = path.join(basePath, currentPath)
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath)
        }
    }
}

module.exports = {
    /**
     * 保存文件到指定目录
     * @param files  connect-multiparty的文件对象数组
     * @param folder 文件夹，数组类型，按数组从头到尾创建文件夹
     * @param reName 如需重命名可赋值 
     * @param limit  校验上传的文件是否符合预设的类型
     * @param appendRandom bool值，为true时会在文件名后再加入一串6个字符的随机数 
     */
    saveAs(files, folder = ['documents'], limit = [], reName = '', appendRandom = false) {
        if (files instanceof Array) {
            // 先判断文件类型是否符合，后将临时目录的文件复制到指定目录中
            return files.map((file) => {
                if (this.validateFileType(file, limit)) {
                    return copy(file, folder, reName, appendRandom)
                }

                return null
            })
        } else {
            if (this.validateFileType(files, limit)) {
                return [copy(files, folder, reName, appendRandom)]
            }

            return []
        }
    },


    /**
     * 创建文件目录
     * @param folder 文件夹，数组类型，按数组从头到尾创建文件夹
     */
    mkdir(folder) {
        mkdir(folder);
    },

    /**
     * 校验上传的文件是否符合指定类型
     * @param file connect-multiparty的文件对象
     */
    validateFileType(file, limit = []) {
        if (fs.existsSync(file.path)) {
            if (limit.length > 0) {
                for (const fileType of limit) {
                    if (!file.path.toLowerCase().endsWith(fileType.ext)) {
                        continue
                    } else if (file.type.toLowerCase() !== fileType.type) {
                        continue
                    }

                    return true
                }

                return false
            }

            return true
        }

        return false
    },

    /**
   * 根据路径获取文件对象
   * @param path 
   */
    getFileByPath(path) {
        if (fs.existsSync(path)) {
            return fs.createReadStream(tempFileInfo.path);
        } else {
            return null;
        }
    },

    /**
   * 删除文件
   * @param path 
   */
    remove(path) {
        if (fs.existsSync(path)) {
            fs.unlinkSync(path)
        }
    },

    all() {
        return union(this.doc(), this.excel(), this.image(), this.pdf(), this.zip())
    },

    doc() {
        return [{
            name: 'Word 97-2004 模板',
            ext: '.dot',
            type: 'application/msword',
        }, {
            name: 'Word 模板',
            ext: '.dotx',
            type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.template',
        }, {
            name: 'Word 97-2004 文档',
            ext: '.doc',
            type: 'application/msword',
        }, {
            name: 'Word 文档',
            ext: '.docx',
            type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        }]
    },

    excel() {
        return [{
            name: 'Excel 97-2004 文档',
            ext: '.xls',
            type: 'application/vnd.ms-excel',
        }, {
            name: 'Excel 97-2004 文档',
            ext: '.xls',
            type: 'application/octet-stream',
        }, {
            name: 'Excel 文档',
            ext: '.xlsx',
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        }]
    },

    image() {
        return [{
            name: 'gif 图片',
            ext: '.gif',
            type: 'image/gif',
        }, {
            name: 'jpeg 图片',
            ext: '.jpeg',
            type: 'image/jpeg',
        }, {
            name: 'jpeg 图片',
            ext: '.jpg',
            type: 'image/jpeg',
        }, {
            name: 'jpg 图片',
            ext: '.jpg',
            type: 'image/jpg',
        }, {
            name: 'png 图片',
            ext: '.png',
            type: 'image/png',
        }]
    },

    pdf() {
        return [{
            name: 'pdf 文件',
            ext: '.pdf',
            type: 'application/pdf',
        }]
    },

    zip() {
        return [{
            name: 'zip 压缩文件',
            ext: '.zip',
            type: 'application/zip',
        }, {
            name: 'zip 压缩文件',
            ext: '.zip',
            type: 'application/octet-stream',
        }, {
            name: 'rar 压缩文件',
            ext: '.rar',
            type: 'application/x-rar',
        }, {
            name: 'rar 压缩文件',
            ext: '.rar',
            type: 'application/x-rar-compressed',
        }, {
            name: 'rar 压缩文件',
            ext: '.rar',
            type: 'application/octet-stream',
        }, {
            name: '7z 压缩文件',
            ext: '.7z',
            type: 'application/x-7z',
        }, {
            name: '7z 压缩文件',
            ext: '.7z',
            type: 'application/x-7z-compressed',
        }, {
            name: '7z 压缩文件',
            ext: '.7z',
            type: 'application/octet-stream',
        }]
    },

}
