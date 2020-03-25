
import {setValue} from '../util/objectUtil.js'


export function vmodel(vm, elm, data) {
    elm.onkeyup = function (event) {
        setValue(vm._data, data, elm.value)
    }
}