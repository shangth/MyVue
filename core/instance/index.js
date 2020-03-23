// 这个文件是Sth的主函数
// 

import {initMixIn} from './init.js';


function Sth(options) {
    // 初始化Sth
    this._init(options);
}
// 添加初始化方法
initMixIn(Sth)

export default Sth