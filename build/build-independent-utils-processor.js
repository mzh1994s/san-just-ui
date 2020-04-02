/**
 * 单个组件在使用utils时，只需要将utils中的方法复制过来就行
 * 编码时一定要规范，utils模块必须使用var utils = require('../utils');
 * 接收，否则无法进行处理
 * 创建日期：2020/4/2
 * @author mzhong
 */
const utils = require('../components/utils');

module.exports = function (fileContent) {
    // 1、查找 var utils = require('../utils');
    let requirePattern = /var utils = require\('\.\.\/utils'\);/;
    let index = fileContent.search(requirePattern);
    if (index !== -1) {
        // 2、查找引用
        let pattern = /utils\.(\S+)\(/g;
        let matches = fileContent.match(pattern);
        if (matches) {
            for (let match of matches) {
                // 获取方法名称
                let funName = match.replace(pattern, '$1');
                // 方法新名称
                let newFunName = '_utils_' + funName;
                // 方法体
                let funBody = 'var ' + newFunName + ' = ' + utils[funName].toString();
                // 格式化
                funBody = funBody.replace(/\r\n/g, '\r\n\t');
                // 将方法体放入组件中
                fileContent = fileContent.replace(requirePattern,
                    funBody + ';\r\nvar utils = require(\'../utils\');');
                // 替换引用
                fileContent = fileContent.replace(pattern, newFunName + '(');
            }
        }
        // 最后去掉 var utils = require('../utils');
        fileContent = fileContent.replace(requirePattern, '');
    }
    return fileContent;
};