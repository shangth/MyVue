// 这个文件是用来存放虚拟节点构造函数的
let num = 0
export default class VNode{
    constructor(
        tag,  // 标签名，例如DIV，SPAN，#TEXT
        elm,  // 真实节点
        children,  // 子节点 
        text,  // 文本（仅文本节点存在）
        data,  // 暂时保留
        parent,  // 父级节点
        nodeType,  // 节点类型
    ) {
        this.tag = tag;
        this.elm = elm;
        this.children = children;
        this.text = text;
        this.data = data;
        this.parent = parent;
        this.nodeType = nodeType;
        this.env = {},  // 环境变量
        this.instructions = null;  // 存放指令
        this.template = [];  // 涉及模板
        this.num = num++
    }
}