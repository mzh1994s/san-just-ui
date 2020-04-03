(function (root) {

    // UI定义区域
    function ui(san) {
        /**
		 * 对话框组件
		 * 创建日期：2020/1/23
		 * @author mzhong
		 */
		var _utils_each = function (list, callback) {
	        var length = list.lenght;
	        for (var i = 0; i < length; i++) {
	            callback(i, list[i]);
	        }
	    };

		return san.defineComponent({
		    template: '<div class="ju-dialog" style="{{cStyle}}"><div class="ju-dialog__header">{{title}}</div><div class="ju-dialog__body"></div><div class="ju-dialog__footer"></div></div>',
		    initData: function () {
		        return {
		            width: '50%',
		            height: '400px'
		        };
		    },
		    attached: function () {
		        _utils_each([1, 2, 3], function (i, item) {
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
    }

    // Export
    if (typeof exports === 'object' && typeof module === 'object') {
        exports = module.exports = ui;
    } else if (typeof define === 'function' && define.amd) {
        define([], ui);
    } else {
        root.justUI = root.justUI || {};
        root.justUI.dialog = ui;
    }
})(this);
