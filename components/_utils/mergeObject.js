/**
 * 合并两个对象
 * @param object1
 * @param object2
 * @returns {{}}
 */
function mergeObject(object1, object2) {
    var merged = {};
    if (object1 && typeof object1 === "object") {
        for (var key in object1) {
            if (object1.hasOwnProperty(key)) {
                merged[key] = object1[key];
            }
        }
    }
    if (object2 && typeof object2 === "object") {
        for (var key2 in object2) {
            if (object2.hasOwnProperty(key2)) {
                merged[key2] = object2[key2];
            }
        }
    }
    return merged;
}