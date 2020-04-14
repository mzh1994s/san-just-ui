/**
 * 飞入
 * 创建日期：2020/4/14
 * @author mzhong
 */
module.exports = {
    enter: function (component) {
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
    leave: function (component) {
        // 删除遮罩
        document.body.removeChild(component.shadeEl);
        component.data.set('cStyle.opacity', 0);
        setTimeout(function () {
            component.data.set('cStyle.display', 'none');
        }, 1000);
    }
}