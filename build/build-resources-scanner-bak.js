/**
 * 处理组件中的require资源
 * 创建日期：2020/4/2
 * @author mzhong
 */
const fs = require('fs');
const path = require('path');
const utils = require('./build-utils');
const conf = require('./build-conf');
const requirePattern = /(var\s+\S+\s+=\s+)?require\(["']+(\S+)['"]+\);?/g;

let processors = {
    html: function (_path, _name) {
        let file = _path + '/' + _name;
        let filepath = path.resolve(file);
        return utils.readFileSync(filepath, function (content) {
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
        let content = utils.readFileSync(filepath);
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
                    let memberDistinctMap = {};
                    resource.members = [];
                    // 查找有哪些地方引用了
                    let referencePattern = new RegExp(resource.var, 'g');
                    let referenceMatches = content.match(referencePattern);
                    if (referenceMatches.length > 1) {
                        let methodPattern = new RegExp(resource.var + '\\.(\\S+)\\(', 'g');
                        let methodMatches = content.match(methodPattern);
                        if (methodMatches) {
                            for (let methodMatch of methodMatches) {
                                let method = methodMatch.replace(methodPattern, '$1');
                                if (!memberDistinctMap[method]) {
                                    memberDistinctMap[method] = true;
                                    // 获取方法名称
                                    resource.members.push(method);
                                }
                            }
                        } else {
                            let script = utils.eval(resource.filepath);
                            for (let member in script) {
                                if (!memberDistinctMap[member]) {
                                    memberDistinctMap[member] = true;
                                    // 获取方法名称
                                    resource.members.push(member);
                                }
                            }
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