(function (root) {

    // 组件资源引用区域
    var _require_Dialog_Dialog_html = '<div class="ju-dialog" style="{{cStyle}}"><div class="ju-dialog__header"><slot name="header">{{title}}<i on-click="onClose()">关闭</i></slot></div><div class="ju-dialog__body"><slot></slot></div><div class="ju-dialog__footer"><slot name="footer"></slot></div></div>';
	var _require_utils_js = {
		each : function (list, callback) {
	        var length = list.length;
	        for (var i = 0; i < length; i++) {
	            callback(i, list[i]);
	        }
	    }
	};
	var _require_Dialog_Dialog_animation_fade_js = {
		enter : function (component) {
	        // 添加遮罩
	        document.body.appendChild(component.shadeEl);
	        // 重新添加会将位置排在最后
	        component.data.set('cStyle.opacity', 0);
	        component.data.set('cStyle.display', 'block');
	        component.data.set('cStyle.transition', 'opacity 1s');
	        document.body.appendChild(component.el);
	        setTimeout(function () {
	            component.data.set('cStyle.opacity', 1);
	        }, 100);
	    },
		leave : function (component) {
	        // 删除遮罩
	        document.body.removeChild(component.shadeEl);
	        component.data.set('cStyle.opacity', 0);
	        setTimeout(function () {
	            component.data.set('cStyle.display', 'none');
	        }, 1000);
	    }
	};

    // 组件定义区域
    function _component(san) {
        var utils = _require_utils_js;
		var animationFade = _require_Dialog_Dialog_animation_fade_js;
		var animation = {
		    // 飞入
		    fade: animationFade
		};
		/**
		 * 对话框组件
		 * 创建日期：2020/1/23
		 * @author mzhong
		 */
		return san.defineComponent({
		    template: _require_Dialog_Dialog_html,
		    initData: function () {
		        return {
		            visible: false,
		            width: '50%',
		            height: '50%',
		            animation: 'fade'
		        };
		    },
		    created: function () {
		        this.shadeEl = document.createElement('div');
		        this.shadeEl.className = 'ju-dialog__shade';
		        utils.each([1, 2, 3], function (i, item) {
		        });
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
		            var currentAnimation = animation[this.data.get('animation')];
		            if (visible) {
		                currentAnimation.enter(this);
		            } else {
		                currentAnimation.leave(this);
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
		            var visible = this.data.get('asyncVisible');
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
        exports = module.exports = _component(require('san'));
    } else if (typeof define === 'function' && define.amd) {
        define(['san'], _component);
    } else {
        root.JU = root.JU || {};
        root.JU.Dialog =  _component(root.san);
    }
})(this);
