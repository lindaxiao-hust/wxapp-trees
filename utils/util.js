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

function formatTime(time) {
  if (typeof time !== 'number' || time < 0) {
    return time
  }

  var hour = parseInt(time / 3600)
  time = time % 3600
  var minute = parseInt(time / 60)
  time = time % 60
  var second = time

  return ([hour, minute, second]).map(function (n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  }).join(':')
}

function formatDateTime(time) {
  var date = new Date(time)
  var Y = date.getFullYear() + '-'
  var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-'
  var D = date.getDate() + ' '
  var h  = (date.getHours() + 1 > 10 ? date.getHours() : '0' + date.getHours()) + ':'
  var m = (date.getMinutes() + 1 > 10 ? date.getMinutes() : '0' + date.getMinutes())
  // var s = date.getSeconds() + 1 > 10 ? date.getSeconds() : '0' + date.getSeconds()
  return Y + M + D + h + m
}

module.exports = {
  getCurrentDate: getCurrentDate,
  isObjOwnEmpty: isObjOwnEmpty,
  formatTime: formatTime,
  formatDateTime: formatDateTime
}
