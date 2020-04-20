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