(function (root) {

    // 组件资源引用区域
    
    // 组件定义区域
    function _component(san) {
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
        exports = module.exports = _component(require('san'));
    } else if (typeof define === 'function' && define.amd) {
        define(['san'], _component);
    } else {
        root.JU = root.JU || {};
        root.JU.Radio =  _component(root.san);
    }
})(this);
