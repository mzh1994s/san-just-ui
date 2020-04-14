var utils = require('../utils');
var animationFade = require('./Dialog-animation-fade');
var animation = {
    // 飞入
    fade: animationFade
};
/**
 * 对话框组件
 * 创建日期：2020/1/23
 * @author mzhong
 */
module.exports = san.defineComponent({
    template: require('Dialog.html'),
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