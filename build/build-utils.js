/**
 * 编译工具类
 * 创建日期：2020/4/14
 * @author mzhong
 */

var fs = require('fs');
var path = require('path');
var conf = require('./build-conf');

exports.buildRequirePattern = function (name) {
    return new RegExp('require\\([\'"]+' + name.replace(/\./g, '\\.') + '[\'"]+\\);?', 'g');
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
        script = eval(content.replace(/(var\s+\S+\s+=\s+)?require\(["']+(\S+)['"]+\);?/g, ''));
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

exports.arrayContains = function (arr, item, prop) {
    if (prop) {
        for (let _item of arr) {
            if (_item[prop] === item[prop]) {
                return true;
            }
        }
    } else {
        for (let _item of arr) {
            if (_item === item) {
                return true;
            }
        }
    }
    return false;
};

exports.arrayMerge = function (arr1, arr2, prop) {
    let arr = [];
    for (let item of arr1) {
        arr.push(item);
    }
    for (let item of arr2) {
        if (!exports.arrayContains(arr, item, prop)) {
            arr.push(item);
        }
    }
    return arr;
};