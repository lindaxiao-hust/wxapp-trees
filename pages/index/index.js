var qcloud = require('../../bower_components/qcloud-weapp-client-sdk/index.js')
var config = require('../../config')

var startPos = 0
var pageSize = config.pageSize

Page({
  onLoad: function() {
    qcloud.request({
      login: true,
      url: config.service.activityRequestUrl + 'concurrent_activity?startPos=' + startPos + '&pageSize=' + pageSize,
      data: {
        startPos: startPos,
        pageSize: pageSize
      },
      success: function(response) {
        console.log(response);
      },
      fail: function(err) {
        console.log(err);
      }
    })
  }
})
