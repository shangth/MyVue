// 预备渲染
// 建立俩映射
// 模板到节点的映射
// 节点到模板的映射

import { getValue } from "../util/objectUtil.js";

let vnode2template = new Map();
let template2vnode = new Map();

// 预备渲染（创建了两个映射）
export function prepareRender(vm, vnode) {
	if (vnode == null) {
		return;
	}
	if (vnode.nodeType == 3) {
		// 文本节点
		analysisTemplateString(vnode);
	}
    if (vnode.nodeType == 0) {
        setTemplate2vnode(vnode, vnode.data);
        setVnode2template(vnode, vnode.data);
    }
	analysisAttr(vm, vnode);
	for (let i = 0; i < vnode.children.length; i++) {
		prepareRender(vm, vnode.children[i]);
	}
}
// 混入渲染方法
export function renderMixIn(Sth) {
	Sth.prototype._render = function() {
		renderNode(this, this._vnode);
	};
}
// 渲染
function renderNode(vm, vnode) {
	if (vnode.nodeType == 3) {
		// 拿到这个文本节点用到的模板
		let templates = vnode2template.get(vnode);
		if (templates != null) {
			let result = vnode.text;
			for (let i = 0; i < templates.length; i++) {
				let templateValue = getTemplateValue(
					[vm._data, vnode.env, vm._computed],
					templates[i]
                );
                if (typeof templateValue == 'function') {
                    templateValue = templateValue.call(vm)
                }
				if (templateValue != null) {
					result = result.replace(
						"{{" + templates[i] + "}}",
						templateValue.toString()
					);
				}
			}
			vnode.elm.nodeValue = result;
		}
	} else if (vnode.nodeType == 1 && vnode.tag == "INPUT") {
		// 拿到这个文本节点用到的模板
		let templates = vnode2template.get(vnode);
		if (templates != null) {
			for (let i = 0; i < templates.length; i++) {
				let templateValue = getTemplateValue(
					[vm._data, vnode.env],
					templates[i]
				);
				if (templateValue != null) {
					vnode.elm.value = templateValue;
				}
			}
		}
	} else {
		for (let i = 0; i < vnode.children.length; i++) {
			renderNode(vm, vnode.children[i]);
		}
	}
}
// 更新某个值
export function renderData(vm, data) {
	let vnodes = template2vnode.get(data);
	if (vnodes != null) {
		for (let i = 0; i < vnodes.length; i++) {
			renderNode(vm, vnodes[i]);
		}
	}
}

// 分析模板字符串
function analysisTemplateString(vnode) {
    let templateStrList = vnode.text.match(/{{[a-zA-Z0-9_$.]+}}/g);
	for (let i = 0; templateStrList && i < templateStrList.length; i++) {
		setTemplate2vnode(vnode, templateStrList[i]);
		setVnode2template(vnode, templateStrList[i]);
	}
}

function setTemplate2vnode(vnode, template) {
	let templateName = getTemplateName(template);
	let templateSet = template2vnode.get(templateName);
	if (templateSet) {
		templateSet.push(vnode);
	} else {
		template2vnode.set(templateName, [vnode]);
	}
}
function setVnode2template(vnode, template) {
	let templateName = getTemplateName(template);
	let vNodeSet = vnode2template.get(vnode);
	if (vNodeSet) {
		vNodeSet.push(templateName);
	} else {
		vnode2template.set(vnode, [templateName]);
	}
}
// 去掉花括号
function getTemplateName(template) {
	if (template.slice(0, 2) == "{{" && template.substr(-2) == "}}") {
		return template.slice(2, -2).trim();
	} else {
		return template;
	}
}

export function getVnode2template() {
	return vnode2template;
}
export function getTemplate2vnode() {
	return template2vnode;
}

export function getTemplateValue(objs, tempalte) {
	for (let i = 0; i < objs.length; i++) {
		let temp = getValue(objs[i], tempalte);
		if (temp != null) {
			return temp;
		}
	}
	return null;
}

function analysisAttr(vm, vnode) {
	if (vnode.nodeType == 1) {
		let attrNames = vnode.elm.getAttributeNames();
		if (attrNames.includes("v-model")) {
			setTemplate2vnode(vnode, vnode.elm.getAttribute("v-model"));
			setVnode2template(vnode, vnode.elm.getAttribute("v-model"));
		}
	}
}

export function getVNodeByTemplate(template) {
	return template2vnode.get(template);
}

export function clearMap() {
	template2vnode.clear();
	vnode2template.clear();
}
