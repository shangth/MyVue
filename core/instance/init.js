// 这个文件主要是给Sth添加初始化方法

import { construtionProxy } from "./proxy.js";
import { mount } from "./mount.js";
import { getVnode2template } from "./render.js";

// 编号，给每个Sth对象都加一个唯一编号，保证不重复
let uid = 0;
export function initMixIn(Sth) {
	Sth.prototype._init = function(options) {
		const vm = this;
		// Sth唯一编号
		this.uid = uid++;
		// 记录一个对象是不是Sth对象
        this.isSth = true;
        


        /////////////////////////////////////////////////////////初始化并执行beforeCreate方法
		// 初始化beforeCreate方法
		if (options && options.beforeCreate) {
			vm._beforeCreate = options.beforeCreate;
		}
		// 生命周期beforeCreate
		if (vm._beforeCreate != null) {
			vm._beforeCreate.call(this);
        }
        


        //////////////////////////////////////////////////////////初始化数据部分
		// 初始化data 递归代理data中的所有值
		if (options && options.data) {
			vm._data = construtionProxy(vm, options.data, "");
		}
		// 初始化methods
		if (options && options.methods) {
			vm._methods = options.methods;
			for (let temp in options.methods) {
				vm[temp] = options.methods[temp];
			}
		}
		// 初始化computed
		if (options && options.computed) {
			vm._computed = options.computed;
        }
        

        /////////////////////////////////////////////////////////初始化并执行created方法
        // 初始化created方法
        if (options && options.created) {
            vm._created = options.created;
        }
		// 生命周期created
		if (vm._created != null) {
			vm._created.call(vm);
        }



        /////////////////////////////////////////////////////////初始化beforeUpdate方法
        // 初始化beforeUpdate方法
        if (options && options.beforeUpdate) {
            vm._beforeUpdate = options.beforeUpdate;
        }
        /////////////////////////////////////////////////////////初始化updated方法
        // 初始化updated方法
        if (options && options.updated) {
            vm._updated = options.updated;
        }
        

        /////////////////////////////////////////////////////////初始化并执行beforeMount、mountd方法以及挂载
		// 初始化beforeMount方法
		if (options && options.beforeMount) {
			vm._beforeMount = options.beforeMount;
		}
		// 初始化mountd方法
		if (options && options.mountd) {
			vm._mountd = options.mountd;
		}
		// 初始化el并挂载
		if (options && options.el) {
			let rootDom = document.getElementById(options.el);
			// 生命周期beforeMount
			if (vm._beforeMount != null) {
				vm._beforeMount.call(this);
			}
			mount(vm, rootDom);
			// 生命周期mountd
			if (vm._mountd != null) {
				vm._mountd.call(this);
			}
        }
        // console.log(getVnode2template())
	};
}
