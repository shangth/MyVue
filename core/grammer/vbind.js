import { getValue } from "../util/objectUtil.js";

export function vbind(vm, elm) {
    let attributes = elm.getAttributeNames();
    let bindList = attributes.filter((item) => item.startsWith('v-bind:') || item.startsWith(':'));
    for (let i = 0; i < bindList.length; i++) {
        let k = bindList[i].split(':')[1]
        let v = elm.getAttribute(bindList[i])
        let value = getValue(vm._data, v);
        elm.setAttribute(k, value)
    }
}