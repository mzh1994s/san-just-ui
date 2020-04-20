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
		    if (object1 && typeof object1 === "object") {
		        for (var key in object1) {
		            if (object1.hasOwnProperty(key)) {
		                merged[key] = object1[key];
		            }
		        }
		    }
		    if (object2 && typeof object2 === "object") {
		        for (var key2 in object2) {
		            if (object2.hasOwnProperty(key2)) {
		                merged[key2] = object2[key2];
		            }
		        }
		    }
		    return merged;
		}
		/**
		 * 添加元素到el中
		 * @param el
		 * @param child
		 */
		function appendElChild(el, child) {
		    try {
		        el.appendChild(child);
		    } catch (e) {
		        // 屏蔽错误消息
		    }
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
		/**
		 * 判断当前浏览器是否支持动画
		 * 创建日期：2020/4/20
		 * @author mzhong
		 */
		function isCss3AnimationSupport() {
		    return 'transition' in document.body.style;
		}
		
		// ---------------动画
		/**
		 * 淡入淡出
		 * 创建日期：2020/4/14
		 * @author mzhong
		 */
		var animationNone = {
		    enter: function (component, done) {
		        // 显示遮罩
		        if (component.data.get('shade')) {
		            component.shadeEl.style.display = 'block';
		        }
		        component.wrapEl.style.display = 'block';
		        // 激活窗口（排到最后去，显示在最上面）
		        appendElChild(document.body, component.wrapEl);
		        done(component);
		    },
		    leave: function (component, done) {
		        // 删除遮罩
		        component.shadeEl.style.display = 'none';
		        // 隐藏对话框
		        component.wrapEl.style.display = 'none';
		        done(component);
		    }
		};
		/**
		 * 淡入淡出
		 * 创建日期：2020/4/14
		 * @author mzhong
		 */
		var animationFade = {
		    css3: {
		        enter: function (component, done) {
		            component.data.set('aStyle.opacity', 0);
		            component.data.set('aStyle.transform', 'translate(0, -100px)');
		            component.data.set('aStyle.transition', 'all 500ms ease');
		            if (component.data.get('shade')) {
		                component.shadeEl.style.display = 'block';
		            }
		            // 显示对话框容器
		            component.wrapEl.style.display = 'block';
		            // 激活窗口（排到最后去，显示在最上面）
		            appendElChild(document.body, component.wrapEl);
		            setTimeout(function () {
		                component.data.set('aStyle.transform', 'translate(0, 0)');
		                component.data.set('aStyle.opacity', 1);
		                done(component);
		            }, 100);
		        },
		        leave: function (component, done) {
		            // 删除遮罩
		            component.shadeEl.style.display = 'none';
		            component.data.set('aStyle.opacity', 0);
		            component.data.set('aStyle.transform', 'translate(0, -100px)');
		            setTimeout(function () {
		                component.wrapEl.style.display = 'none';
		                done(component);
		            }, 500);
		        }
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
		    template: '<div class="ju-dialog" style="{{cStyle}}"><div class="ju-dialog-header"><slot name="header">{{title}}</slot><i class="fa fa-close" on-click="onClose()"></i></div><div class="ju-dialog-body"><slot>{{content}}</slot></div><div class="ju-dialog-footer"><slot name="footer"></slot></div></div>',
		    initData: function () {
		        return {
		            visible: false, // 是否可见
		            width: '50%', // 宽度
		            animation: 'fade', // 动画
		            shade: true, // 遮罩
		            aStyle: {} // 动画样式
		        };
		    },
		    attached: function () {
		        // 创建外围dom
		        this.wrapEl = document.createElement('div');
		        this.wrapEl.className = 'ju-dialog-wrap';
		        // 创建遮罩dom
		        this.shadeEl = document.createElement('div');
		        this.shadeEl.className = 'ju-dialog-shade';
		        this.wrapEl.appendChild(this.shadeEl);
		        // 创建滚动层
		        this.scrollEl = document.createElement('div');
		        this.scrollEl.className = 'ju-dialog-scroll-el';
		        this.wrapEl.appendChild(this.scrollEl);
		        // 将el添加到可滚动区域
		        this.scrollEl.appendChild(this.el);
		        this._attachedVisibleSetting();
		    },
		    detached: function () {
		        this._detachedVisibleSetting();
		    },
		    _attachedVisibleSetting: function () {
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
		        var currentAnimationGroup = animation[this.data.get('animation')];
		        // 无动画
		        var currentAnimation = animationNone;
		        if (currentAnimationGroup) {
		            if (isCss3AnimationSupport() && currentAnimationGroup.css3) {
		                currentAnimation = currentAnimationGroup.css3;
		            } else if (currentAnimationGroup.js) {
		                currentAnimation = currentAnimationGroup.js;
		            }
		        }
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
		        removeElChild(document.body, this.shadeEl);
		        removeElChild(document.body, this.wrapEl);
		        this.wrapEl = null;
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
