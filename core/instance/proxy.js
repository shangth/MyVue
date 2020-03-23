// 递归代理data对象

// vm表示Sth对象，obj表示要代理的对象，namespace表示命名空间
export function construtionProxy(vm, data, namespace) {
    let proxy = null
    if (data instanceof Array) {

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
        console.log(prop);
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
        if (obj[prop] instanceof Object) {
            proxyObj[prop] = construtionProxy(vm, obj[prop], getNameSpace(namespace, prop))
        }
    }
    return proxyObj
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