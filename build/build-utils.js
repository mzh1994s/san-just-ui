/**
 * 编译工具类
 * 创建日期：2020/4/14
 * @author mzhong
 */

var fs = require('fs');
var path = require('path');
var conf = require('./build-conf');

exports.buildRequirePattern = function (name) {
    return new RegExp('require\\([\'"]+' + name.replace(/\./g, '\\.') + '[\'"]+\\)', 'g');
};

exports.readFileSync = function (filepath, contentFilter) {
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

exports.eval = function (filepath) {
    let script = global.buildContext.evalCache[filepath];
    if (!script) {
        let content = exports.readFileSync(filepath);
        script = eval(content);
        global.buildContext.evalCache[filepath] = script;
    }
    return script;
};


exports.USER_DIR = path.resolve(__dirname, '../');
exports.COMPONENTS_DIR = exports.USER_DIR + '/components';

exports.getUserDir = function () {
    return exports.USER_DIR;
};

exports.resolveResourceName = function (filepath) {
    return filepath.substring(exports.COMPONENTS_DIR.length + 1).replace(/[-.\\]/g, '_');
};