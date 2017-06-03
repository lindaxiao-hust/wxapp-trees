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
      url: config.service.recommendRequestUrl + 'tweet',
      success: function(response) {
        console.log(response);
        if (response.statusCode === 200) {
          // 日期时间格式化处理
          var tweets = response.data.tweets
          tweets.forEach(function(tweet) {
            tweet.createTime = util.formatDateTime(tweet.createTime)
          })
          that.setData({
            dataLoadStatus: 'success',
            tweets: tweets // 推荐活动
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
