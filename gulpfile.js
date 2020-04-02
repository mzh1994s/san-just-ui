const {src, dest, series} = require('gulp');
// 文件合并
const concat = require('gulp-concat');
// js压缩
const uglify = require('gulp-uglify');

function _default() {
}

exports.default = series(_default);