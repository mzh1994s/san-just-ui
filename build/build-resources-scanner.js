/**
 * 处理组件中的require资源
 * 创建日期：2020/4/2
 * @author mzhong
 */
const fs = require('fs');
const path = require('path');
const bf = require('./build-file');
const conf = require('./build-conf');
const requirePattern = /(var\s+\S+\s+=\s+)?require\(["']+(\S+)['"]+\);?/g;

let processors = {
    html: function (_path, _name) {
        let file = _path + '/' + _name;
        let filepath = path.resolve(file);
        return bf.read(filepath, function (content) {
            return {
                filepath: filepath,
                content: content.replace(/\r\n/g, '').replace(/\s{2}/g, '')
            };
        });
    },
    js: function (_path, _name) {
        let file = _path + '/' + _name;
        if (!_name.endsWith('.js')) {
            file = file + '.js';
        }
        let filepath = path.resolve(file);
        let content = bf.read(filepath);
        let resources = [];
        let matches = content.match(requirePattern);
        if (matches) {
            for (let match of matches) {
                let sourceName = match.replace(requirePattern, '$2');
                let resource = _require(_path, sourceName);
                resource.match = match;
                resource.name = sourceName;
                resource.var = match.replace(requirePattern, '$1')
                    .replace(/var\s+(\S+)\s+=/, '$1')
                    .trim();
                if (resource.var) {
                    resource.methods = [];
                    // 查找有哪些地方引用了
                    let methodPattern = new RegExp(resource.var + '\\.(\\S+)\\(', 'g');
                    let methodMatches = content.match(methodPattern);
                    if (methodMatches) {
                        for (let methodMatch of methodMatches) {
                            // 获取方法名称
                            resource.methods.push(methodMatch.replace(methodPattern, '$1'));
                        }
                    }
                }
                resources.push(resource);
            }
        }
        return {
            filepath: filepath,
            resources: resources,
            content: content
        };
    }
};

let _require = function (_path, _name) {
    // 查找处理器，默认处理器是js处理器
    let type = 'js';
    let processor = processors[type];
    // 查找处理器
    for (let pKey in processors) {
        if (_name.endsWith('.' + pKey)) {
            type = pKey;
            processor = processors[pKey];
        }
    }
    return Object.assign({type: type}, processor(_path, _name));
};

module.exports = _require;