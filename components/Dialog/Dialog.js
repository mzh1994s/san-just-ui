/**
 * TODO
 * 创建日期：2020/1/23
 * @author mzhong
 */
var utils = require('../utils');
module.exports = san.defineComponent({
    template: require('text!Dialog.html'),
    attached: function () {
        utils.each([1, 2, 3], function (i, item) {
            console.log(item);
        })
    }
});