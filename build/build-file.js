/**
 * 文件操作
 * 创建日期：2020/4/2
 * @author mzhong
 */
const fs = require('fs');
const path = require('path');
const conf = require('./build-conf');
/**
 * 复制文件
 * @param source
 * @param target
 */
exports.copy = function (source, target) {
    let stat = fs.statSync(source);
    if (stat.isFile()) {
        let fileContent = fs.readFileSync();
        console.log(fileContent);
    } else if (stat.isDirectory()) {
        let files = fs.readDirSync(source);
        for (let file in files) {
            exports.copy(source + '/' + file, target + '/' + file);
        }
    }
};

exports.read = function (filepath, contentFilter) {
    let content = global.buildContext.fileCache[filepath];
    if (!content) {
        content = fs.readFileSync(filepath).toString(conf.encoding);
        if (typeof contentFilter === "function") {
            content = contentFilter(content);
        }
        global.buildContext.fileCache[filepath] = content;
    }
    return content;
};

exports.USER_DIR = path.resolve(__dirname, '../');
exports.COMPONENTS_DIR = exports.USER_DIR + '/components';

exports.getUserDir = function () {
    return exports.USER_DIR;
};

exports.resolveResourceName = function (filepath) {
    return filepath.substring(exports.COMPONENTS_DIR.length + 1).replace(/[-.\\]/g, '_');
};