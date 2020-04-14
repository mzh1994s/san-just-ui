const clean = require('./build-clean');
const independent = require('./build-independent');
// 编译上下文对象
let buildContext = {
    version: '1.0.0',
    fileCache: {},
    evalCache: {}
};

exports.build = function () {
    global.buildContext = buildContext;
    console.log('开始打包');
    // 清空目录
    clean();
    // 打包单个
    independent();
};

exports.build();