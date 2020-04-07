/**
 * 多个组件打包成一个文件
 * 创建日期：2020/4/7
 * @author mzhong
 */

// 配置
const conf = require('./build-conf');
const copyfile = require('./build-copyfile');
const requireProcessor = require('./build-require-processor');
// 文件操作
const fs = require('fs');
const jsTemplate = fs.readFileSync('build/build-export-template.js').toString(conf.encoding);

function _buildComponentJavascript(name) {
    let componentPath = conf.in + '/' + name;
    let file = componentPath + '/' + name + '.js';
    if (fs.existsSync(file)) {
        let fileContent = fs.readFileSync(file).toString(conf.encoding);
        // 将module.exports替换为return
        fileContent = fileContent.replace(/module.exports =/, 'return');
        // 缩进
        fileContent = fileContent.replace(/\r\n/g, '\r\n\t\t');
        // 处理require资源
        fileContent = requireProcessor(fileContent, componentPath);
        // 替换组件定义区域
        fileContent = jsTemplate.replace(/root\.JU\.component/, "root.JU." + name)
            .replace(/\/\/!__component_area__/, fileContent);
        // 输出到目录
        fs.writeFileSync(conf.out + '/' + name + '.js', fileContent);
    }
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
    console.log('打包为一个文件');
    // 读取组件目录
    let files = fs.readdirSync(conf.in);
    for (let file of files) {
        let stat = fs.statSync(conf.in + '/' + file);
        if (stat.isDirectory()) {
            _buildComponent(file);
        }
    }
};