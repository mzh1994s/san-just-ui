/**
 * 打包成单个组件
 * 创建日期：2020/4/2
 * @author mzhong
 */

// 配置
const conf = require('./build-conf');
const copyfile = require('./build-copyfile');
const requireProcessor = require('./build-require-processor');
const utilsProcessor = require('./build-independent-utils-processor');
// 文件操作
const fs = require('fs');
const jsTemplate = fs.readFileSync('build/build-out-js-template.js').toString(conf.encoding);


function _buildComponent(name) {
    let file = conf.in + '/' + name + '/' + name + '.js';
    if (fs.existsSync(file)) {
        let fileContent = fs.readFileSync(file).toString(conf.encoding);
        // 将module.exports替换为return
        fileContent = fileContent.replace(/module.exports =/, 'return');
        // 缩进
        fileContent = fileContent.replace(/\r\n/g, '\r\n\t\t');
        // 处理utils
        fileContent = utilsProcessor(fileContent);
        // 处理require资源
        fileContent = requireProcessor(fileContent, name);
        // 替换组件定义区域
        let firstLowerCaseName = name.substring(0, 1).toLowerCase() + name.substring(1);
        fileContent = jsTemplate.replace(/root\.justUI\.ui/, "root.justUI." + firstLowerCaseName)
            .replace(/\/\/!__component_area__/, fileContent);
        // 输出到目录
        fs.writeFileSync(conf.out + '/' + name + '.js', fileContent);
    }
}

module.exports = function () {
    console.log('打包独立文件');
    // 读取组件目录
    let files = fs.readdirSync(conf.in);
    for (let file of files) {
        let stat = fs.statSync(conf.in + '/' + file);
        if (stat.isDirectory()) {
            _buildComponent(file);
        }
    }
};