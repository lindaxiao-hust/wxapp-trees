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
      url: config.service.recommendRequestUrl + 'plant',
      success: function(response) {
        console.log(response);
        if (response.statusCode === 200) {
          that.setData({
            dataLoadStatus: 'success',
            plants: response.data.plants // 推荐活动
          })
        } else {
          that.setData({
            dataLoadStatus: 'fail'
          })
        }
      },
      fail: function(err) {
        that.setData({
          dataLoadStatus: 'fail'
        })
      }
    })
  }
})
