var utils = require('../utils');

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
            height: '400px'
        };
    },
    created: function () {
        this.shadeEl = document.createElement('div');
        this.shadeEl.className = 'ju-dialog__shade';
        utils.each([1, 2, 3], function (i, item) {
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