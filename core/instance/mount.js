// 挂载方法


import VNode from "../vdom/vnode.js";
import {prepareRender, getVnode2template, getTemplate2vnode} from "./render.js";
import { vmodel } from "../grammer/vmodel.js";
import { vforInit } from "../grammer/vfor.js";
import { mergeAttr } from "../util/objectUtil.js";

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
    let vnode = analysisAttr(vm, elm, parent);
    if (!vnode) {
        let children = [];
        let text = getNodeText(elm);
        let data = null;
        let nodeType = elm.nodeType;
        let tag = elm.nodeName;
        vnode = new VNode(tag, elm, children, text, data, parent, nodeType);
        if (elm.nodeType == 1 && elm.getAttribute('env')) {
            vnode.env = mergeAttr(vnode.env, JSON.parse(elm.getAttribute('env')))
        } else {
            vnode.env = mergeAttr(vnode.env, parent ? parent.env : {})
        }
    }
    
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

function analysisAttr(vm, elm, parent) {
    if (elm.nodeType == 1) {
        let attrNames = elm.getAttributeNames();
        if (attrNames.includes('v-model')) {
            vmodel(vm, elm, elm.getAttribute('v-model'))
        }
        if (attrNames.includes('v-for')) {
            return vforInit(vm, elm, parent, elm.getAttribute('v-for'));
        }
    }
}

// function mergeAttr(obj1, obj2) {
//     if (!obj1) {
//         return Object.assign({}, obj2)
//     } 
//     if (!obj2) {
//         return Object.assign({}, obj1)
//     }
//     return Object.assign(obj1, obj2)
// }