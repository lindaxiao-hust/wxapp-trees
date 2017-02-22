/**
**  获取当前时间
**/
function getCurrentDate() {
  return new Date().toLocaleString()
}

/**
**  判断一个对象是否为空，不包含原型
**/
function isObjOwnEmpty(obj) {
  for(let name in obj) {
    if(obj.hasOwnProperty(name)) {
      return false
    }
  }
  return true
}

module.exports = {
  getCurrentDate: getCurrentDate,
  isObjOwnEmpty: isObjOwnEmpty
}
