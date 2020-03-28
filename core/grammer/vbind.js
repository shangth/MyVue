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
    // bind只能存在标签节点上，如果这个节点不是标签节点，直接返回
    if (vnode.nodeType != 1) {
        return
    }
    let attrNames = vnode.elm.getAttributeNames();
    // 获取需要绑定的数据
    let filterAttrNames = attrNames.filter((item) => item.startsWith('v-bind:') || item.startsWith(':'))
    for (let i = 0; i < filterAttrNames.length; i++) {
        let value = vnode.elm.getAttribute(filterAttrNames[i]);
        // 绑定的属性 :class  trueAtrr为class
        let trueAtrr = filterAttrNames[i].split(':')[1];
        // 判断:class的是否是一个表达式
        if (/^{[\w\W]+}$/.test(value)) {
            // 是表达时的话需要语法分析
            let str = value.slice(1, -1);
            let expressionList = str.split(',');
            // 获取分析结果
            let result = analysisExpression(vm, vnode, expressionList);
            vnode.elm.setAttribute(trueAtrr, result)
        } else {
            // 不是的话直接拿到真实值，并赋值
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