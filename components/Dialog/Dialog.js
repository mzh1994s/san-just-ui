/**
 * 对话框组件
 * 创建日期：2020/1/23
 * @author mzhong
 */
var utils = require('../utils');
module.exports = san.defineComponent({
    template: require('text!Dialog.html'),
    initData: function () {
        return {
            width: '50%',
            height: '400px'
        };
    },
    attached: function () {
        utils.each([1, 2, 3], function (i, item) {
            console.log(item);
        })
    },
    computed: {
        cStyle: function () {
            return {
                width: this.data.get('width'),
                height: this.data.get('height')
            }
        }
    }
});