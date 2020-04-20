(function (root) {
    // 组件定义区域
    function _component(san) {
        // ---------------工具
		/**
		 * 合并两个对象
		 * @param object1
		 * @param object2
		 * @returns {{}}
		 */
		function mergeObject(object1, object2) {
		    var merged = {};
		    if (typeof object1 === "object") {
		        for (var key in object1) {
		            if (object1.hasOwnProperty(key)) {
		                merged[key] = object1[key];
		            }
		        }
		    }
		    if (typeof object2 === "object") {
		        for (var key2 in object2) {
		            if (object2.hasOwnProperty(key2)) {
		                merged[key2] = object2[key2];
		            }
		        }
		    }
		    return merged;
		}
		/**
		 * 从el中移除元素
		 * @param el
		 * @param child
		 */
		function removeElChild(el, child) {
		    try {
		        el.removeChild(child);
		    } catch (e) {
		        // 屏蔽错误消息
		        // 当使用s-if时会自动卸载dom，手动卸载会报错
		    }
		}
		
		// ---------------动画
		/**
		 * 淡入淡出
		 * 创建日期：2020/4/14
		 * @author mzhong
		 */
		var animationFade = {
		    enter: function (component, done) {
		        // 添加遮罩
		        document.body.appendChild(component.shadeEl);
		        // 重新添加会将位置排在最后
		        component.data.set('aStyle.opacity', 0);
		        component.data.set('aStyle.transform', 'translate(0, -100px)');
		        component.data.set('aStyle.transition', 'all 500ms ease');
		        component.data.set('aStyle.display', 'block');
		        document.body.appendChild(component.el);
		        setTimeout(function () {
		            component.data.set('aStyle.transform', 'translate(0, 0)');
		            component.data.set('aStyle.opacity', 1);
		            done(component);
		        }, 100);
		    },
		    leave: function (component, done) {
		        // 删除遮罩
		        removeElChild(document.body, component.shadeEl);
		        component.data.set('aStyle.opacity', 0);
		        component.data.set('aStyle.transform', 'translate(0, -100px)');
		        setTimeout(function () {
		            component.data.set('aStyle.display', 'none');
		            done(component);
		        }, 500);
		    }
		};
		var animation = {
		    // 飞入
		    fade: animationFade
		};
		
		// ---------------组件
		/**
		 * 对话框组件
		 * 创建日期：2020/1/23
		 * @author mzhong
		 */
		var Dialog = san.defineComponent({
		    template: '<div class="ju-dialog" style="{{cStyle}}"><div class="ju-dialog__header"><slot name="header">{{title}}<i on-click="onClose()"></i></slot></div><div class="ju-dialog__body"><slot></slot></div><div class="ju-dialog__footer"><slot name="footer"></slot></div></div>',
		    initData: function () {
		        return {
		            visible: false,
		            width: '50%',
		            height: '200px',
		            animation: 'fade',
		            icon: {
		                name: window.JU.config.iconName || 'fa'
		            }
		        };
		    },
		    created: function () {
		        this.shadeEl = document.createElement('div');
		        this.shadeEl.className = 'ju-dialog__shade';
		    },
		    attached: function () {
		        this._attachedVisibleSetting();
		    },
		    detached: function () {
		        this._detachedVisibleSetting();
		    },
		    _attachedVisibleSetting: function () {
		        // 将el加载到body下
		        document.body.appendChild(this.el);
		        // 监听visible变化执行动画
		        // 动画组件中操作cStyle和cClassName来操作动画
		        this.watch('visible', function (visible) {
		            this._startAnimation(visible);
		        });
		        // 如果默认显示，则触发动画
		        if (this.data.get('visible')) {
		            this._startAnimation(true);
		        }
		    },
		    _startAnimation: function (visible, done) {
		        var _this = this;
		        var currentAnimation = animation[this.data.get('animation')];
		        if (visible) {
		            currentAnimation.enter(this, function () {
		                _this.fire('open');
		                done && done();
		            });
		        } else {
		            currentAnimation.leave(this, function () {
		                _this.fire('close');
		                done && done();
		            });
		        }
		    },
		    _detachedVisibleSetting: function () {
		        // 当作为子组件使用时，父组件卸载的时候不会自动卸载，需要手动卸载
		        removeElChild(document.body, this.el);
		        removeElChild(document.body, this.shadeEl);
		        this.shadeEl = null;
		    },
		    onClose: function () {
		        this.data.set('visible', false);
		    },
		    computed: {
		        cStyle: function () {
		            var cStyle = {
		                top: document.documentElement.clientHeight / 5 + 'px',
		                width: this.data.get('width'),
		                height: this.data.get('height')
		            };
		            // 合并aStyle
		            return mergeObject(cStyle, this.data.get('aStyle'));
		        }
		    }
		});
		return Dialog;
    }

    // Export
    if (typeof exports === 'object' && typeof module === 'object') {
        exports = module.exports = _component(require('san'));
    } else if (typeof define === 'function' && define.amd) {
        define(['san'], _component);
    } else {
        root.justUI = root.justUI || {};
        root.justUI.Dialog =  _component(root.san);
    }
})(this);
