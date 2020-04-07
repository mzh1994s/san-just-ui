/**
 * 处理组件中的require资源
 * 创建日期：2020/4/2
 * @author mzhong
 */
const conf = require('./build-conf');
const fs = require('fs');
const path = require('path');
const requirePattern = /(var\s+\S+\s+=\s+)?require\(["']+(\S+)['"]+\);?/g;

// 处理器文件缓存
let processorCache = {};

let processors = {
    '.html': function (match, name, componentFileContent, componentPath) {
        let file = path.resolve(componentPath + '/' + name);
        let content = processorCache[file];
        if (!content) {
            content = fs.readFileSync(file).toString(conf.encoding);
            content = content.replace(/\s{2}/g, '');
            content = "'" + content.replace(/'/g, "\\'") + "'";
            processorCache[file] = content;
        }
        return componentFileContent.replace(match, content);
    },
    '.js': function (match, name, componentFileContent, componentPath) {
        let _var = match.replace(requirePattern, '$1')
            .replace(/var\s+(\S+)\s+=/, '$1')
            .trim();
        let file = path.resolve(componentPath + '/' + name + '.js');
        let javascript = processorCache[file];
        if (!javascript) {
            javascript = eval(fs.readFileSync(file).toString(conf.encoding));
            processorCache[file] = javascript;
        }
        // 查找有哪些地方引用了
        let referencePattern = new RegExp(_var + '\\.(\\S+)\\(', 'g');
        let referenceMatches = componentFileContent.match(referencePattern);
        if (referenceMatches) {
            for (let referenceMatch of referenceMatches) {
                // 获取方法名称
                let funName = referenceMatch.replace(referencePattern, '$1');
                // 方法新名称
                let newFunName = '_r_' + _var + '_' + funName;
                if (componentFileContent.indexOf(newFunName) === -1) {
                    // 方法体
                    let funBody = 'var ' + newFunName + ' = ' + javascript[funName].toString();
                    // 格式化
                    funBody = funBody.replace(/\r\n/g, '\r\n\t');
                    // 将方法体放入组件中
                    componentFileContent = funBody + ';\r\n\t\t' + componentFileContent;
                    // 替换引用
                    componentFileContent = componentFileContent.replace(referencePattern, newFunName + '(');
                }
            }
        }
        // 去掉require
        return componentFileContent.replace(match + '\r\n', '');
    }
};

module.exports = function (componentFileContent, componentPath) {
    let matches = componentFileContent.match(requirePattern);
    if (matches) {
        for (let match of matches) {
            let name = match.replace(requirePattern, '$2');
            let processor = processors['.js'];
            // 查找处理器
            for (let processorName in processors) {
                if (name.endsWith(processorName)) {
                    processor = processors[processorName];
                }
            }
            componentFileContent = processor(match, name, componentFileContent, componentPath);
        }
    }
    return componentFileContent;
};