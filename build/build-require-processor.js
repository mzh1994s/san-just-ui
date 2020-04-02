/**
 * 处理组件中的require资源
 * 创建日期：2020/4/2
 * @author mzhong
 */
const conf = require('./build-conf');
const fs = require('fs');

/**
 * 读取文件
 * @param file
 * @returns {string}
 * @private
 */
function _readResource(file) {
    let fileContent = fs.readFileSync(file).toString(conf.encoding);
    return fileContent.replace(/\s{2}/g, '');
}

module.exports = function (componentFileContent, componentName) {
    let pattern = /require\(["']+(\S+)['"]+\)/g;
    let matches = componentFileContent.match(pattern);
    if (matches) {
        for (let match of matches) {
            let value = match.replace(pattern, '$1');
            if (value.startsWith('text!')) {
                value = value.substring(5);
                let content = _readResource(conf.in + '/' + componentName + '/' + value);
                content = "'" + content.replace(/'/g, "\\'") + "'";
                componentFileContent = componentFileContent.replace(match, content);
            }
        }
    }
    return componentFileContent;
};