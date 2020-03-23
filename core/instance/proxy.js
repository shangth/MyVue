// 递归代理data对象
// 这里有三个主要方法
// construtionProxy               代理不知道是对象还是数组的对象
// construtionObjectProxy         代理对象      代理数组主要做的是递归代理自己和自己下面的属性
// construtionArrayProxy          代理数组      代理数组主要做的是代理数组本身和自己的方法

// vm表示Sth对象，obj表示要代理的对象，namespace表示命名空间
// 判断data的数据类型，做不同的代理
export function construtionProxy(vm, data, namespace) {
    debugger
    let proxy = null
    // console.log(data, data instanceof Array, data instanceof Object)
    if (data instanceof Array) {
        proxy = new Array(data.length);
        for (let i = 0; i < data.length; i++) {
            if (data[i] instanceof Object) proxy[i] = construtionProxy(vm, data[i], namespace)
        }
        proxy = construtionArrayProxy(vm, data, namespace)
    } else if (data instanceof Object) {
        proxy = construtionObjectProxy(vm, data, namespace)
    } else {
        throw '代理对象只能为对象或数组'
    }
    return proxy
}

// 对象代理方法
function construtionObjectProxy(vm, obj, namespace) {
    let proxyObj = {};
    for (let prop in obj) {
        Object.defineProperty(proxyObj, prop, {
            configurable: true,
            get() {
                return obj[prop]
            },
            set(value) {
                console.log(`${getNameSpace(namespace, prop)}属性修改，新的值为${value}`)
                obj[prop] = value;
            }
        })
        Object.defineProperty(vm, prop, {
            configurable: true,
            get() {
                return obj[prop]
            },
            set(value) {
                console.log(`${getNameSpace(namespace, prop)}属性修改，新的值为${value}`)
                obj[prop] = value;
            }
        })
        // 递归 由于不知道obj[prop]是数组还是对象，所以使用construtionProxy
        if (obj[prop] instanceof Object) {
            proxyObj[prop] = construtionProxy(vm, obj[prop], getNameSpace(namespace, prop))
        }
    }
    return proxyObj
}

// 代理数组
function construtionArrayProxy(vm, arr, namespace) {
    let obj = {
        eletype: "Array",
        toString: () => {
            let result = '';
            for (let i = 0; i < arr.length; i++) {
                result += arr[i] + ', '
            }
            return result.substr(0, -2)
        },
        push() {},
        pop() {},
        shift() {},
        unshift() {},
        splice() {},
    }
    defArrayFunc.call(vm, obj, 'push', namespace, vm);
    defArrayFunc.call(vm, obj, 'pop', namespace, vm);
    defArrayFunc.call(vm, obj, 'shift', namespace, vm);
    defArrayFunc.call(vm, obj, 'unshift', namespace, vm);
    defArrayFunc.call(vm, obj, 'splice', namespace, vm);

    arr.__proto__ = obj;
    return arr
}

// 代理数组方法
const arrayProto = Array.prototype;
function defArrayFunc(obj, funcName, namespace, vm) {
    Object.defineProperty(obj, funcName, {
        enumerable: true,
        configurable: true,
        value: function(...args) {
            let originFun = arrayProto[funcName];
            const result = originFun.apply(this, args);
            console.log(`${funcName}方法被调用`)
            return result
        }
    })
}








// 工具函数
// 获取命名空间
function getNameSpace(nowNameSpace, prop) {
    if (nowNameSpace == null || nowNameSpace == '') {
        return prop
    } else if (prop == null || prop == '') {
        return nowNameSpace
    } else {
        return nowNameSpace + '.' + prop
    }
}