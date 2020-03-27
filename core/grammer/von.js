import { getValue } from "../util/objectUtil.js";

export function checkVOn(vm, vnode) {
    if (vnode.nodeType == 1) {
        let attrNames = vnode.elm.getAttributeNames();
        let filterAttrNames = attrNames.filter((item) => item.startsWith('v-on:') || item.startsWith('@'))
        for (let i = 0; i < filterAttrNames.length; i++) {
            von(vm, vnode, filterAttrNames[i].split(':')[1], vnode.elm.getAttribute(filterAttrNames[i]))
        }
    }
}

function von(vm, vnode, event, name) {
    let method = getValue(vm._methods, name);
    if (method) {
        vnode.elm.addEventListener(event, method.bind(vm))
    }
}