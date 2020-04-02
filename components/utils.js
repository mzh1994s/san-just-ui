/**
 * TODO
 * 创建日期：2020/4/2
 * @author mzhong
 */
module.exports = {
    each: function (list, callback) {
        var length = list.lenght;
        for (var i = 0; i < length; i++) {
            callback(i, list[i]);
        }
    }
};