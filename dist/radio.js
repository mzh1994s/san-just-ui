(function (root) {
    // 组件定义区域
    function _component(san) {
        /**
		 * TODO
		 * 创建日期：2020/1/23
		 * @author mzhong
		 */
		module.exports = san.defineComponent({
		    template: ''
		});
		return Radio;
    }

    // Export
    if (typeof exports === 'object' && typeof module === 'object') {
        exports = module.exports = _component(require('san'));
    } else if (typeof define === 'function' && define.amd) {
        define(['san'], _component);
    } else {
        root.justUI = root.justUI || {};
        root.justUI.Radio =  _component(root.san);
    }
})(this);
