/**
 * TODO
 * 创建日期：2020/4/2
 * @author mzhong
 */
const fs = require('fs');

module.exports = function (source, target) {
    let stat = fs.statSync(source);
    if (stat.isFile()) {
        let fileContent = fs.readFileSync();
        console.log(fileContent);
    } else if (stat.isDirectory()) {
        let files = fs.readDirSync(source);
        for (let file in files) {
            module.exports(source + '/' + file, target + '/' + file);
        }
    }
};