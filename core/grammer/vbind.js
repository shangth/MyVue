import { getValue, getEnvAttr } from "../util/objectUtil.js";
import { getTemplateValue } from "../instance/render.js";
import { generateCode, isTrue } from "../util/code.js";

// export function vbind(vm, elm) {
//     let attributes = elm.getAttributeNames();
//     let bindList = attributes.filter((item) => item.startsWith('v-bind:') || item.startsWith(':'));
//     for (let i = 0; i < bindList.length; i++) {
//         let k = bindList[i].split(':')[1];
//         console.log(elm.getAttribute(bindList[i]))
//         if (/^{[\w\W]+}$/.test(elm.getAttribute(bindList[i]))) {
//             console.log(elm.getAttribute(bindList[i])) // {big: obj.x > 0, red: obj.y > 1}
//             let str = elm.getAttribute(bindList[i]).slice(1, -1).trim();
//             let expression = str.split(',');
//             console.log(expression);
//             let result = analysisExpression(vm, )
//         } else {
//             let v = elm.getAttribute(bindList[i])
//             let value = getValue(vm._data, v);
//             elm.setAttribute(k, value)
//         }
//     }
// }

export function checkVBind(vm, vnode) {
    if (vnode.nodeType != 1) {
        return
    }
    let attrNames = vnode.elm.getAttributeNames();
    let filterAttrNames = attrNames.filter((item) => item.startsWith('v-bind:') || item.startsWith(':'))
    for (let i = 0; i < filterAttrNames.length; i++) {
        let value = vnode.elm.getAttribute(filterAttrNames[i]);
        let trueAtrr = filterAttrNames[i].split(':')[1];
        if (/^{[\w\W]+}$/.test(value)) {
            let str = value.slice(1, -1);
            let expressionList = str.split(',');
            let result = analysisExpression(vm, vnode, expressionList);
            vnode.elm.setAttribute(trueAtrr, result)
        } else {
            let trueValue = getTemplateValue([vm._data, vnode.env], value);
            vnode.elm.setAttribute(trueAtrr, trueValue)
        }
    }
}
// 分析表达式 返回class列表
function analysisExpression(vm, vnode, expressionList) {
    // 获取当前环境变量
    let attr = getEnvAttr(vm, vnode);
    // 判断表达式是否成立
    let envCode = generateCode(attr);
    // 拼接result
    let result = '';
    for (let i = 0; i < expressionList.length; i++) {
        // let site = expressionList[i].split(':')
        if (expressionList[i].includes(':')) {
            let expressionKV = expressionList[i].split(':');
            let code = expressionKV[1];
            // 结合环境变量，验证条件是否成立
            if (isTrue(code, envCode)) {
                result += expressionKV[0] + ' '
            }
        } else {
            result += expressionList[i] + ' '
        }
    }
    return result
}