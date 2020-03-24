// 挂载方法


import VNode from "../vdom/vnode.js";
import {prepareRender} from "./render.js";

export function initMount(Sth) {
    Sth.prototype.$mount = function (el) {
        let vm = this;
        let rootDom = document.getElementById(el);
        mount(vm, rootDom);
    }
}
export function mount(vm, el) {
    // 进行挂载(生成虚拟dom树)
    vm._vnode = constructVNode(vm, el, null);
    // 进行预备渲染（将模板转换为对应的值）
    prepareRender(vm, vm._vnode)
}

function constructVNode(vm, elm, parent) { // 深搜
    let vnode = null;
    let children = [];
    let text = getNodeText(elm);
    let data = null;
    let nodeType = elm.nodeType;
    let tag = elm.nodeName;
    vnode = new VNode(tag, elm, children, text, data, parent, nodeType);

    let childs = vnode.elm.childNodes;
    for (let i = 0; i < childs.length; i++) {
        let childNodes = constructVNode(vm, childs[i], vnode);
        if (childNodes instanceof VNode) {
            vnode.children.push(childNodes)
        } else { // v-for 返回节点数组
            vnode.children = vnode.children.concat(childNodes)
        }
    }
    return vnode
}

function getNodeText(elm) {
    if (elm.nodeType == 3) {
        return elm.nodeValue;
    } else {
        return ''
    }
}