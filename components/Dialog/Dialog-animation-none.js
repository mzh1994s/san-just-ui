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