// 这个文件是Sth的主函数
// 

import {initMixIn} from './init.js';
import {renderMixIn} from './render.js';


function Sth(options) {
    // 初始化Sth
    this._init(options);
    // 渲染
    this._render()
}
// 添加初始化方法
initMixIn(Sth)
renderMixIn(Sth)

export default Sth