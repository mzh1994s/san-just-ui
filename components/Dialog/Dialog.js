// ---------------工具
require('../_utils/mergeObject');
require('../_utils/appendElChild');
require('../_utils/removeElChild');
require('../_utils/isCss3AnimationSupport');

// ---------------动画
require('./Dialog-animation-none');
require('./Dialog-animation-fade');
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
    template: require('Dialog.html'),
    initData: function () {
        return {
            visible: false, // 是否可见
            width: '50%', // 宽度
            animation: 'fade', // 动画
            shade: true, // 遮罩
            aStyle: {}, // 动画样式
            footerHide: false, // 隐藏页脚
            headerHide: false, // 隐藏页头
            closeable: true // 可关闭
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
    setTop: function () {
        appendElChild(document.body, this.wrapEl);
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