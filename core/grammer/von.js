import { getValue } from "../util/objectUtil.js";
import { getTemplateValue } from "../instance/render.js";

export function checkVOn(vm, vnode) {
    // console.log(vnode)
    if (vnode.nodeType == 1) {
        let attrNames = vnode.elm.getAttributeNames();
        let filterAttrNames = attrNames.filter((item) => item.startsWith('v-on:') || item.startsWith('@'));
        // console.log(vnode,filterAttrNames)
        for (let i = 0; i < filterAttrNames.length; i++) {
            let eventName = filterAttrNames[i].includes(':') ? filterAttrNames[i].split(':')[1] : filterAttrNames[i].split('@')[1];
            // console.log(eventName)
            von(vm, vnode, eventName, vnode.elm.getAttribute(filterAttrNames[i]))
        }
    }
}

function von(vm, vnode, eventName, name) {
    console.log(name);
    let argList = []
    let index = name.indexOf('(');
    let funName = name
    if (index >= 0) {
        funName = name.slice(0, index);
        argList = name.slice(index + 1, -1).split(',');
        console.log(argList);
    }
    for (let i = 0; i < argList.length; i++) {
        argList[i] = getTemplateValue([vm._data, vnode.env],argList[i])
    }
    console.log(argList)
    let method = getValue(vm._methods, funName);
    if (method) {
        // console.log(eventName)
        vnode.elm.addEventListener(eventName, method.bind(vm, ...argList))
    }
}