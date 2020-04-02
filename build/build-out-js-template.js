(function (root) {

    // UI定义区域
    function ui(san) {
        //!__component_area__
    }

    // Export
    if (typeof exports === 'object' && typeof module === 'object') {
        exports = module.exports = ui;
    } else if (typeof define === 'function' && define.amd) {
        define([], ui);
    } else {
        root.justUI = root.justUI || {};
        root.justUI.ui = ui;
    }
})(this);
