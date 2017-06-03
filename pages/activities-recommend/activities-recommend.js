var qcloud = require('../../bower_components/qcloud-weapp-client-sdk/index.js')
var config = require('../../config')
var util = require('../../utils/util.js')

Page({
  data: {
    httpsHost: config.service.httpsHost,
    dataLoadStatus: 'loading', //判断页面数据是否加载状态
    defaultImg: config.defaultImg // 默认图片
  },
  onLoad: function() {
    var that = this
    qcloud.request({
      login: true,
      url: config.service.recommendRequestUrl + 'activity',
      success: function(response) {
        console.log(response);
        if (response.statusCode === 200) {
          // 日期时间格式化处理
          var activities = response.data.activities
          activities.forEach(function(activity) {
            activity.startTime = util.formatDateTime(activity.startTime)
            activity.endTime = util.formatDateTime(activity.endTime)
          })
          that.setData({
            dataLoadStatus: 'success',
            activities: activities // 推荐活动
          })
        } else {
          that.setData({
            dataLoadStatus: 'fail'
          })
        }
      },
      fail: function(err) {
        console.log(err);
        that.setData({
          dataLoadStatus: 'fail'
        })
      }
    })
  }
})
