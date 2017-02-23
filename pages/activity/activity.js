var qcloud = require("../../bower_components/qcloud-weapp-client-sdk/index.js")
var config = require("../../config")

Page({
  data: {
      trees: [
        {
          id: 1,
          hasCollected: true
        },
        {
          id: 2,
          hasCollected: false
        },
        {
          id: 3,
          hasCollected: true
        },
        {
          id: 4,
          hasCollected: true
        },
        {
          id: 5,
          hasCollected: true
        },
        {
          id: 6,
          hasCollected: false
        },
        {
          id: 7,
          hasCollected: true
        },
        {
          id: 8,
          hasCollected: true
        },
        {
          id: 10,
          hasCollected: false
        },
        {
          id: 11,
          hasCollected: true
        },
      ]
  },
  onLoad: function(option) {
    console.log(option);
    qcloud.request({
      login: true,
      url: config.service.activityRequestUrl + 'detail/aid=' + option.activityId,
      success: function(response) {
        console.log(response);
      },
      fail: function(err) {
        console.log(err);
      }
    })
  }
})
