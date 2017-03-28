var qcloud = require('../../bower_components/qcloud-weapp-client-sdk/index.js')
var config = require('../../config')
var util = require('../../utils/util.js')

var pageSize = config.pageSize //传给服务器的查询长度

Page({
  data: {
    dataLoadStatus: 'loading',//判断页面数据是否加载状态
    plantId: 0, //植物id，由链接参数获取
    loadmore: true, //是否正在加载
    loadend: false, //是否已全部加载完成
    loadFail: false //是否加载失败
    // activityInfoList: [] //记录请求后的所有活动
  },
  onLoad: function(option) {
    this.setData({
      plantId: option.plant_id
    })
    this.requestActivity()
  },
  requestActivity: function() {
    var that = this
    qcloud.request({
      login: true,
      // url: config.service.activityRequestUrl + 'all/pid=2',
      url: config.service.activityRequestUrl + 'all/pid=' + that.data.plantId,
      success: function(response) {
        console.log(response);
        if (response.statusCode === 200) {
          var activityListTmp = response.data.activityList
          // 若植物当前没有活动，则跳转至植物介绍页面
          if (activityListTmp.length === 0) {
            wx.redirectTo({
              url: '../tree/tree?plant_id=' + that.data.plantId
              // url: '../tree/tree?plant_id=1'
            })
          } else if(activityListTmp.length === 1) {
            wx.redirectTo({
              url: '../tree/tree?plant_id=' + that.data.plantId + '&activity_id=' + activityListTmp[0].activityId
              // url: '../tree/tree?plant_id=1&activity_id=1'
            })
          } else {
            for (let index in activityListTmp) {
              activityListTmp[index].startTime = util.formatDateTime(activityListTmp[index].startTime)
              activityListTmp[index].endTime = util.formatDateTime(activityListTmp[index].endTime)
            }
            that.setData({
              dataLoadStatus: 'success',
              plantInfo: response.data.plantInfo,
              activityInfoList: activityListTmp,
              loadend: true,
              loadFail: false,
              loadmore: false
            })
          }
        } else {
          //非200的情况，如400,500，可加弹窗提示错误类型，注：小程序将500认为success，返回500页面信息
          that.setData({
            dataLoadStatus: 'fail',
            loadFail: true,
            loadmore: false
          })
        }
      },
      fail: function(err) {
        console.log(err);
        that.setData({
          dataLoadStatus: 'fail',
          loadFail: true,
          loadmore: false
        })
      }
    })
  },
  //上拉触底刷新，首次加载失败后需能触发
  onReachBottom: function() {
    //正在加载或已加载完时reachbottom无效
    if (this.data.loadmore === false && this.data.loadend === false) {
      //正在加载
      this.setData({
        loadmore: true,
        loadFail: false
      })

      this.requestActivity()
    }
  }
})
