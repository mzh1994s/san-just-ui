/**
 * TODO
 * 创建日期：2020/4/2
 * @author mzhong
 */
const fs = require('fs');
const conf = require('./build-conf');

/**
 * 递归删除文件或者文件夹
 * @param path
 * @private
 */
function _rmRf(path) {
    let stat = fs.statSync(path);
    if (stat.isFile()) {
        fs.unlinkSync(path);
    } else {
        let files = fs.readdirSync(path);
        if (files.length) {
            for (let file of files) {
                _rmRf(path + '/' + file);
            }
        }
        fs.rmdirSync(path);
    }
}

module.exports = function () {
    let exists = fs.existsSync(conf.out);
    if (exists) {
        _rmRf(conf.out);
    }
    fs.mkdirSync(conf.out);
};