/**
 * 判断当前浏览器是否支持动画
 * 创建日期：2020/4/20
 * @author mzhong
 */
function isCss3AnimationSupport() {
    return 'transition' in document.body.style;
}