var qcloud = require('../../bower_components/qcloud-weapp-client-sdk/index.js')
var config = require('../../config')

var startPos = 0
var pageSize = config.pageSize

Page({
  onLoad: function(option) {
    console.log(option);
    qcloud.request({
      login: true,
      url: config.service.tweetRequestUrl + 'wxlist?plantId=' + option.plantId + '&startPos=' + startPos + '&pageSize=' + pageSize,
      data: {
        plantId: option.plantId,
        startPos: startPos,
        pageSize: pageSize
      },
      method: 'POST',
      success: function(response) {
        console.log(response);
      },
      fail: function(err) {
        console.log(err);
      }
    })
  }
})
