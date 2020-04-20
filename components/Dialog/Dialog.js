// ---------------工具
require('../_utils/mergeObject');
require('../_utils/removeElChild');

// ---------------动画
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
            visible: false,
            width: '50%',
            height: '200px',
            animation: 'fade'
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