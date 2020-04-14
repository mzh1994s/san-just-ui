/**
 * 编译工具类
 * 创建日期：2020/4/14
 * @author mzhong
 */
exports.buildRequirePattern = function (name) {
    return new RegExp('require\\([\'"]+' + name.replace(/\./g, '\\.') + '[\'"]+\\)', 'g');
};