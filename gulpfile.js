const {src, dest, series} = require('gulp');
// 文件合并
const concat = require('gulp-concat');
// js压缩
const uglify = require('gulp-uglify');

function javascript() {
    return src('./components/*/*.js')
        .pipe(concat('index.js'))
        .pipe(uglify())
        .pipe(dest('./components/'));
}

exports.javascript = series(javascript);