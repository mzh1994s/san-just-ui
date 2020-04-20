/**
 * 遍历数组
 * @param list
 * @param callback
 */
function each(list, callback) {
    var length = list.length;
    for (var i = 0; i < length; i++) {
        callback(i, list[i]);
    }
}