(function (root) {

    // UI定义区域
    function ui(san) {
        /**
		 * TODO
		 * 创建日期：2020/1/23
		 * @author mzhong
		 */
		return san.defineComponent({
		    template: ''
		});
    }

    // Export
    if (typeof exports === 'object' && typeof module === 'object') {
        exports = module.exports = ui;
    } else if (typeof define === 'function' && define.amd) {
        define([], ui);
    } else {
        root.justUI = root.justUI || {};
        root.justUI.radio = ui;
    }
})(this);
