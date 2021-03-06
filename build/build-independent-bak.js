/**
 * 打包成单个组件
 * 创建日期：2020/4/2
 * @author mzhong
 */

// 配置
const conf = require('./build-conf');
const resourceScanner = require('./build-resources-scanner');
// 文件操作
const fs = require('fs');
const utils = require('./build-utils');
const exportTemplate = fs.readFileSync('build/build-export-template.js').toString(conf.encoding);


function _mergeResources(resources, type) {
    let _resourcesMap = {};
    for (let item of resources) {
        if (!type || item.type === type) {
            _resourcesMap[item.filepath] = _resourcesMap[item.filepath] || [];
            _resourcesMap[item.filepath].push(item);
        }
        if (item.resources) {
            let itemResources = _mergeResources(item.resources, type);
            for (let filepath in itemResources) {
                if (itemResources.hasOwnProperty(filepath)) {
                    var _resources = utils.arrayMerge(_resourcesMap[filepath] || [], itemResources[filepath]);
                    if (_resources.length) {
                        _resourcesMap[filepath] = _resources;
                    }
                }
            }
        }
    }
    return _resourcesMap;
}

function _buildComponentJavascript(name) {
    let data = resourceScanner(conf.in + '/' + name, name);
    let content = data.content.replace(/module\.exports\s+=/, 'return')
        .replace(/\r\n/g, '\r\n\t\t');
    // 组件定义区域
    content = exportTemplate.replace('//__hook_component_content__', content);
    // 组件资源引用表
    let textResourceMap = _mergeResources(data.resources, 'html');
    // 文本资源引用
    let resourceHook = '//__hook_component_resources__';
    for (let filepath in textResourceMap) {// 遍历表
        let textResources = textResourceMap[filepath];
        // 一个文件可能有多个引用
        if (textResources.length) {
            // 取第一个，生成变量
            let textResource = textResources[0];
            let resourceVarName = '_require_' + utils.resolveResourceName(textResource.filepath);
            let resourceContent = textResource.content.replace(/'/g, "\'");
            content = content.replace(resourceHook,
                'var ' + resourceVarName + " = '" + resourceContent + "';\r\n" + resourceHook);
            // 替换引用（require(xxx)替换为上面的变量引用）
            for (let textResource of textResources) {
                content = content.replace(utils.buildRequirePattern(textResource.name), resourceVarName)
            }
        }
    }
    // 代码引用
    let scriptResourceMap = _mergeResources(data.resources, 'js');
    for (let filepath in scriptResourceMap) {
        let scriptResources = scriptResourceMap[filepath];
        if (scriptResources.length) {
            let scriptResource = scriptResources[0];
            let script = utils.eval(filepath);
            let resourceVarName = '_require_' + utils.resolveResourceName(scriptResource.filepath);
            let resourceContent = '{';
            let resourceScript = {};
            let methodWriteFlag = {};
            for (let scriptResource of scriptResources) {
                for (let member of scriptResource.members) {
                    if (!methodWriteFlag[member]) {
                        methodWriteFlag[member] = true;
                        resourceScript[member] = script[member];
                        resourceContent += '\r\n\t\t';
                        resourceContent += member + ' : ' + script[member].toString().replace(/\r\n/g, '\r\n\t') + ',';
                    }
                }
                if (resourceContent.endsWith(',')) {
                    resourceContent = resourceContent.substring(0, resourceContent.length - 1);
                }
                content = content.replace(utils.buildRequirePattern(scriptResource.name), resourceVarName);
            }
            resourceContent += '\r\n\t};';
            content = content.replace(resourceHook,
                '\tvar ' + resourceVarName + ' = ' + resourceContent + "\r\n" + resourceHook);
        }
    }
    // 删除钩子
    content = content.replace(resourceHook, '');
    // 替换组件名
    content = content.replace(/root\.JU\.component =/, 'root.JU.' + name + ' = ');
    // 输出文件
    fs.writeFileSync(conf.out + '/' + name + '.js', content);
}

function _buildComponentCss(name) {
    let file = conf.in + '/' + name + '/' + name + '.css';
    if (fs.existsSync(file)) {
        let outFile = conf.out + '/' + name + '.css';
        fs.writeFileSync(outFile, fs.readFileSync(file).toString(conf.encoding));
    }
}

function _buildComponent(name) {
    _buildComponentJavascript(name);
    _buildComponentCss(name);
}

module.exports = function () {
    // 读取组件目录
    let files = fs.readdirSync(conf.in);
    for (let file of files) {
        let stat = fs.statSync(conf.in + '/' + file);
        if (stat.isDirectory()) {
            console.log('打包单个组件：' + file);
            _buildComponent(file);
        }
    }
};