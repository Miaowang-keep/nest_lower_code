/*
 * @Author: miaowang
 * @Description: 常用工具函数
 * @Date: 2021-06-18 16:22:13
 * @LastEditTime: 2021-07-15 15:50:14
 * @LastEditors: miaowang
 */

/**
 * @Author: miaowang
 * @description: 判断一个值是否是undefined 或者 null
 * @param  {*}
 * @return {*}
 * @param {any} v
 */
export function isUndef(v: any): boolean {
    return v === undefined || v === null;
  }
  
  /**
   * @Author: miaowang
   * @description: 创建一个空对象
   * @param  {*}
   * @return {*}
   */
  export const emptyObject = Object.freeze({});
  
  /**
   * @Author: miaowang
   * @description: 判断一个变量是否是对象
   * @param  {*}
   * @return {*} true；Object
   * @param {unknown} obj
   */
  export function isObject(obj: unknown): boolean {
    return obj !== null && typeof obj === 'object';
  }
  
  const _toString = Object.prototype.toString;
  
  /**
   * @Author: miaowang
   * @description: 检查 obj 是否是普通对象。 也就是说该对象由 Object 构造函数创建或者 [[Prototype]] 为空。
   * @param  {*}
   * @return {*}
   * @param {Object} obj
   */
  
  /*
    function Foo() {
      this.a = 1;
     }
     isPlainObject( new Foo() )  => false
  
     isPlainObject([1, 2, 3]);   => false
  
     isPlainObject({ 'x': 0, 'y': 0 });  => true
  
     isPlainObject(Object.create(null)); => true
  */
  export function isPlainObject(obj: any): boolean {
    return _toString.call(obj) === '[object Object]';
  }
  
  /**
   * @Author: miaowang
   * @description: 判断一个普通的obj是否是空对象
   * @param  {*}
   * @return {*}
   * @param {Object} obj
   */
  export function isEmptyObject(obj: any): boolean {
    //检查是否是普通对象，如果不是直接返回 false
    if (!isPlainObject(obj)) {
      return false;
    }
    if (isUndef(obj)) {
      return true;
    }
    return Object.keys(obj).length === 0;
  }

  export function isEmptyString(obj: any): boolean {
    if (isUndef(obj)) 
      return false
      obj.trim() === ''?true:false;
  }
  
  /**
   * @description 对象属性赋值，不扩展新的属性
   * @param targetObj
   * @param sourceObj
   * @returnl Object
   */
  export function objAssignedProperty(targetObj: any, sourceObj: any): any {
    Object.preventExtensions(targetObj);
    for (const key in targetObj) {
      if (sourceObj[key]) {
        targetObj[key] = sourceObj[key];
      }
    }
    return targetObj;
  }
  
  /**
   * @description 列表转树 单循环 Map结构
   * @param list
   * @param rootPid
   * @return {*[]}
   */
  
  export function listToTree_SingleFor(
    list: Array<any>,
    rootPid: any,
  ): Array<any> {
    const dataMap = {};
    const result = [];
    list.forEach((item) => {
      dataMap[item.id] = { ...item, children: [] };
      const id = item.id;
      const pid = item.pid;
      const childrenItem = item;
      if (rootPid === pid) {
        result.push(dataMap[item.id]);
      } else {
        if (!dataMap[pid]) {
          dataMap[pid] = {
            children: [],
          };
        } else {
          dataMap[pid].children.push(dataMap[id]);
        }
      }
    });
    return result;
  }
  
  /**
   * @description 列表转树 多根节点版
   * @param list
   * @param myId
   * @param myPid
   */
  export function listToTree_NoPid(
    list: any,
    myId: string,
    myPid: string,
  ): Array<any> {
    const hash = new Map(),
      roots = [];
    list.forEach((item) => {
      if ('id' != myId) {
        item.id = item[myId];
      }
      if ('pid' != myPid) {
        item.pid = item[myPid];
      }
    });
    const idList = list.map((item) => item.id);
    const rootNodes = list.filter((item) => {
      return !idList.includes(item.pid);
    });
    rootNodes.forEach((item) => {
      hash.set(item['id'], item);
    });
    list.forEach((item) => {
      hash.set(item['id'], item);
      const parent = hash.get(item['pid']);
      if (!parent) {
        roots.push(item);
      } else {
        !parent.children && (parent.children = []);
        parent.children.push(item);
      }
    });
    return roots;
  }
  