(function (root) {

    // 组件资源引用区域
    //__hook_component_resources__
    // 组件定义区域
    function _component(san) {
        //__hook_component_content__
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
