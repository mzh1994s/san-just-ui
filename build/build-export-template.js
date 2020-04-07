(function (root) {

    // 组件定义区域
    function _component(san) {
        //!__component_area__
    }

    // Export
    if (typeof exports === 'object' && typeof module === 'object') {
        exports = module.exports = _component(require('san'));
    } else if (typeof define === 'function' && define.amd) {
        define(['san'], _component);
    } else {
        root.JU = root.JU || {};
        root.JU.component = _component(root.san);
    }
})(this);
