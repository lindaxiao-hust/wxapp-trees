var qcloud = require('../../bower_components/qcloud-weapp-client-sdk/index.js')
var config = require('../../config')
var util = require('../../utils/util.js')

var pageSize = config.pageSize//传给服务器的查询长度

Page({
  globalData: {
    startPos: 0,//传给服务器的查询起点
    init: true,//记录是否为第一次请求服务器
    activityTotalNum: 0,//记录每一次请求得到的活动数
  },
  data: {
    loadmore: true,//是否正在加载
    loadend: false,//是否已全部加载完成
    loadFail: false,//是否加载失败
    activityInfoList: [],//记录每一次请求后的所有活动
    activityTotalNumInit: -1//记录第一次请求服务器后得到的活动数
  },
  onLoad: function() {
    this.requestActivity()
  },
  loadEnded: function() {
    return this.globalData.startPos + pageSize >= this.data.activityTotalNumInit ? true : false
  },
  requestActivity: function() {
    var that = this
    qcloud.request({
      login: true,
      url: config.service.activityRequestUrl + 'concurrent_activity?startPos=' + that.globalData.startPos + '&pageSize=' + pageSize,
      data: {
        startPos: that.globalData.startPos,
        pageSize: pageSize
      },
      success: function(response) {
        console.log(response);
        if(response.statusCode === 200) {
          that.globalData.activityTotalNum = response.data.activityTotalNum
          //记录下页面首次向服务器请求得到的列表长度
          if(that.globalData.init) {
            that.setData({
              activityTotalNumInit: that.globalData.activityTotalNum
            })
            that.globalData.init = false
          }
          var activityInfoListTmp = response.data.activityInfoList
          for(let index in activityInfoListTmp) {
            activityInfoListTmp[index].startTime = util.formatDateTime(activityInfoListTmp[index].startTime)
            activityInfoListTmp[index].endTime = util.formatDateTime(activityInfoListTmp[index].endTime)
          }
          that.setData({
            activityInfoList: that.data.activityInfoList.concat(activityInfoListTmp),
            loadend: that.loadEnded(),
            loadFail: false,
            loadmore: false
          })
        } else {
          //非200的情况，如400,500，可加弹窗提示错误类型
          that.setData({
            loadFail: true,
            loadmore: false
          })
        }
      },
      fail: function(err) {
        console.log(err);
        that.setData({
          loadFail: true,
          loadmore: false
        })
      }
    })
  },
  //上拉触底刷新
  onReachBottom: function() {
    //正在加载或已加载完时reachbottom无效
    if(this.data.loadmore === false && this.data.loadend === false) {
      // 若继续请求服务器要重新计算startPos，要注意减去新增的部分
      if(this.data.loadFail === false) {
        this.globalData.startPos = this.globalData.startPos + pageSize + this.globalData.activityTotalNum - this.data.activityTotalNumInit
      }

      //正在加载
      this.setData({
        loadmore: true,
        loadFail: false
      })

      //若加载失败直接重新加载
      this.requestActivity()
    }
  }
})
