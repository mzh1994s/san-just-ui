(function (root) {

    // 组件定义区域
    function _component(san) {
        var _r_utils_each = function (list, callback) {
	        var length = list.lenght;
	        for (var i = 0; i < length; i++) {
	            callback(i, list[i]);
	        }
	    };
				
		/**
		 * 对话框组件
		 * 创建日期：2020/1/23
		 * @author mzhong
		 */
		return san.defineComponent({
		    template: '<div class="ju-dialog" style="{{cStyle}}"><div class="ju-dialog__header"><slot name="header">{{title}}<i on-click="onClose()">关闭</i></slot></div><div class="ju-dialog__body"><slot></slot></div><div class="ju-dialog__footer"><slot name="footer"></slot></div></div>',
		    initData: function () {
		        return {
		            visible: false,
		            width: '50%',
		            height: '400px'
		        };
		    },
		    created: function () {
		        this.shadeEl = document.createElement('div');
		        this.shadeEl.className = 'ju-dialog__shade';
		        _r_utils_each([1, 2, 3], function (i, item) {
		            console.log(i);
		        })
		    },
		    attached: function () {
		        this._attachedVisibleSetting();
		    },
		    detached: function () {
		        this._detachedVisibleSetting();
		    },
		    _attachedVisibleSetting: function () {
		        document.body.appendChild(this.el);
		        this.watch('visible', function (visible) {
		            if (visible) {
		                // 添加遮罩
		                document.body.appendChild(this.shadeEl);
		                // 重新添加会将位置排在最后
		                document.body.appendChild(this.el);
		            } else {
		                // 删除遮罩
		                document.body.removeChild(this.shadeEl);
		            }
		        });
		    },
		    _detachedVisibleSetting: function () {
		        try {
		            document.body.removeChild(this.el);
		        } catch (e) {
		        }
		    },
		    onClose: function () {
		        this.data.set('visible', false);
		    },
		    computed: {
		        cStyle: function () {
		            var visible = this.data.get('visible');
		            return {
		                width: this.data.get('width'),
		                height: this.data.get('height'),
		                // display: visible ? 'block' : 'none',
		                opacity: visible ? 1 : 0
		            }
		        }
		    }
		});
    }

    // Export
    if (typeof exports === 'object' && typeof module === 'object') {
        exports = module.exports = _component(require('san'));
    } else if (typeof define === 'function' && define.amd) {
        define(['san'], _component);
    } else {
        root.JU = root.JU || {};
        root.JU.Dialog = _component(root.san);
    }
})(this);
