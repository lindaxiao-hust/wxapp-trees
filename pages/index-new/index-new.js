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
    console.log('onload');
  },
  onShow: function() {
    console.log('onshow');
    console.log('getCurrentPages():'+getCurrentPages().length);
    var that = this
    qcloud.request({
      login: true,
      url: config.service.recommendRequestUrl + 'homepage',
      success: function(response) {
        if (response.statusCode === 200) {
          console.log(response);
          // 日期时间格式化处理
          var activities = response.data.activities
          if(activities) {
            activities.forEach(function(activity) {
              activity.startTime = util.formatDateTime(activity.startTime)
              activity.endTime = util.formatDateTime(activity.endTime)
            })
          }

          var tweets = response.data.tweets
          if(tweets) {
            tweets.forEach(function(tweet) {
              tweet.createTime = util.formatDateTime(tweet.createTime)
            })
          }

          that.setData({
            dataLoadStatus: 'success',
            plants: response.data.plants,
            activities: activities,
            tweets: tweets
          })
        } else {
          that.setData({
            dataLoadStatus: 'fail'
          })
        }
      },
      fail: function(err) {
        dataLoadStatus: 'fail'
      }
    })
  }
});
