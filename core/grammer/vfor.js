

import VNode from '../vdom/vnode.js'
import { getValue, mergeAttr } from '../util/objectUtil.js';


// vm, elm, parent, (item,index) in list
export function vforInit(vm, elm, parent, instructions) {
    // 创建虚拟节点
    let virtualNode = new VNode(elm.nodeName, elm, [], '', getVirtualNodeData(instructions)[2], parent, 0);
    // 添加指令
    virtualNode.instructions = instructions;
    parent.elm.removeChild(elm);
    parent.elm.appendChild(document.createTextNode(''));
    analysisInstructions(vm, instructions, elm, parent);
    return virtualNode 
}

// 分解vfor指令 分解为数组
function getVirtualNodeData(instructions) {
    let inSet = instructions.trim().split(' ');
    if (inSet.length != 3 || inSet[1] != 'in' && inSet[1] != 'of') {
        throw new Error('v-for语法错误，应为(item, index) in list')
    }
    return inSet
}
// 分析指令
function analysisInstructions(vm, instructions, elm, parent) {
    let inSet = getVirtualNodeData(instructions);
    // 获取list的值
    let dataSet = getValue(vm._data, inSet[2]);
    if (!dataSet) {
        throw new Error(`${inSet[2]}不存在`)
    }
    let resultSet = [];
    let attributeList = elm.getAttributeNames();
    for (let i = 0; i < dataSet.length; i++) {
        // 根据list生成新的节点
        let tempDom = document.createElement(elm.nodeName);
        // 将模板放在新节点内
        tempDom.innerHTML = elm.innerHTML;
        // 生成局部变量保存在env中
        let env = analysisKV(inSet[0], dataSet[i], i);
        tempDom.setAttribute('env', JSON.stringify(env));
        // 给新节点添加虚拟节点其他属性 例如src, class, id等
        for (let j = 0; j < attributeList.length; j++) {
            if (attributeList[j] != 'v-for') {
                tempDom.setAttribute(attributeList[j], elm.getAttribute(attributeList[j]));
            }
        }
        // 添加到父级节点
        parent.elm.appendChild(tempDom);
        resultSet.push(tempDom)
    }
    return resultSet
}

// 分析指令，生成局部变量
function analysisKV(instructions, value, index) {
    if (/([a-zA-Z0-9_$]+)/.test(instructions)) {
        instructions = instructions.trim();
        instructions = instructions.slice(1, -1)
    }
    let keys = instructions.split(','); // [item] || [item, index]
    if (keys.length == 0) {
        throw new Error('v-for语法错误，应为(item, index) in list')
    } 
    let obj = {};
    if (keys.length == 1) {
        obj[keys[0].trim()] = mergeAttr(value);
    }
    if (keys.length == 2) {
        obj[keys[0].trim()] = mergeAttr(value);
        obj[keys[1].trim()] = index;
    }
    return obj
}