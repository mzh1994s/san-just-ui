exports.merge = function (arr1, arr2, prop) {
    let arr = [];
    for (let item of arr1) {
        arr.push(item);
    }
    for (let item of arr2) {
        if (!exports.contains(arr, item, prop)) {
            arr.push(item);
        }
    }
    return arr;
};
exports.contains = function (arr, item, prop) {
    if (prop) {
        for (let _item of arr) {
            if (_item[prop] === item[prop]) {
                return true;
            }
        }
    } else {
        for (let _item of arr) {
            if (_item === item) {
                return true;
            }
        }
    }
    return false;
};