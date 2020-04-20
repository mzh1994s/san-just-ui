/**
 * 添加元素到el中
 * @param el
 * @param child
 */
function appendElChild(el, child) {
    try {
        el.appendChild(child);
    } catch (e) {
        // 屏蔽错误消息
    }
}