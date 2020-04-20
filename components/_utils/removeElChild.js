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