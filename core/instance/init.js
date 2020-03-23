// 这个文件主要是给Sth添加初始化方法

import {construtionProxy} from './proxy.js'


// 编号，给每个Sth对象都加一个唯一编号，保证不重复
let uid = 0;
export function initMixIn(Sth) {
    Sth.prototype._init = function (options) {
        const vm = this;
        // Sth唯一编号
        this.uid = uid++;
        // 记录一个对象是不是Sth对象
        this.isSth = true;
        // 初始化data
        if (options && options.data) {
            vm._data = construtionProxy(vm, options.data, '')
        }
        // 初始化created方法
        // 初始化methods
        // 初始化computed
        // 初始化el并挂载
    }
}