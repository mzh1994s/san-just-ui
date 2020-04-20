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