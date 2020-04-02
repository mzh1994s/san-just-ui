console.log('开始打包');
const clean = require('./build-clean');
const independent = require('./build-independent');

// 清空目录
clean();
// 打包单个
independent();