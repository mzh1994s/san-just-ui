/**
 * 打包成单个组件
 * 创建日期：2020/4/2
 * @author mzhong
 */

// 配置
const conf = require('./build-conf');
const bArray = require('./build-array');
const resourceScanner = require('./build-resources-scanner');
// 文件操作
const fs = require('fs');
const bf = require('./build-file');
const bu = require('./build-utils');
const exportTemplate = fs.readFileSync('build/build-export-template.js').toString(conf.encoding);


function _mergeResources(resources, type) {
    let _resources = {};
    for (let item of resources) {
        _resources[item.filepath] = _resources[item.filepath] || [];
        if (!type || item.type === type) {
            _resources[item.filepath].push(item);
        }
        if (item.resources) {
            let itemResources = _mergeResources(item.resources, type);
            for (let filepath in itemResources) {
                _resources[filepath] = _resources[filename] || [];
                _resources[filepath].push(itemResources[filename]);
            }
        }
    }
    return _resources;
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
            let resourceVarName = '_require_' + bf.resolveResourceName(textResource.filepath);
            let resourceContent = textResource.content.replace(/'/g, "\'");
            content = content.replace(resourceHook,
                'var ' + resourceVarName + " = '" + resourceContent + "';\r\n" + resourceHook);
            // 替换引用（require(xxx)替换为上面的变量引用）
            for (let textResource of textResources) {
                content = content.replace(bu.buildRequirePattern(textResource.name), resourceVarName)
            }
        }
    }
    // 代码引用
    let scriptResourceMap = _mergeResources(data.resources, 'js');
    for (let filename in scriptResourceMap) {
        let scriptResources = scriptResourceMap[filename];
        if (scriptResources.length) {
            let scriptResource = scriptResources[0];
            let script = global.buildContext.evalCache[filename] || eval(scriptResource.content);
            let resourceVarName = '_require_' + bf.resolveResourceName(scriptResource.filepath);
            let resourceContent = '{';
            let resourceScript = {};
            let methodWriteFlag = {};
            for (let scriptResource of scriptResources) {
                for (let method of scriptResource.methods) {
                    if (!methodWriteFlag[method]) {
                        methodWriteFlag[method] = true;
                        resourceScript[method] = script[method];
                        resourceContent += '\r\n\t\t';
                        resourceContent += method + ' : ' + script[method].toString().replace(/\r\n/g, '\r\n\t');
                    }
                }
                content = content.replace(bu.buildRequirePattern(scriptResource.name), resourceVarName);
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