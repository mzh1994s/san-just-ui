(function (root) {
    // 组件定义区域
    function _component(san) {
        /**
		 * 按钮组件
		 * 创建日期：2020/4/20
		 * @author mzhong
		 */
		var Button = san.defineComponent({
		    template: ''
		});
		return Button;
    }

    // Export
    if (typeof exports === 'object' && typeof module === 'object') {
        exports = module.exports = _component(require('san'));
    } else if (typeof define === 'function' && define.amd) {
        define(['san'], _component);
    } else {
        root.justUI = root.justUI || {};
        root.justUI.Button =  _component(root.san);
    }
})(this);
