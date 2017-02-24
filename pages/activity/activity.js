var qcloud = require("../../bower_components/qcloud-weapp-client-sdk/index.js")
var config = require("../../config.js")
var util = require("../../utils/util.js")

Page({
  data: {
    host: 'https://' + config.service.host,
    startTime: '',
    endTime: '',
    mapName: '',
    activityInfo: {},
    plantPointTotalNum: 0,
    hasCollectPlantPointNum: 0
  },
  onLoad: function(option) {
    console.log('*****************'+this.data.host);
    var that = this
    qcloud.request({
      login: true,
      url: config.service.activityRequestUrl + 'detail/aid=' + option.activityId,
      success: function(response) {
        console.log(response);
        var activityInfo = response.data.activityInfo
        that.setData({
          activityInfo: activityInfo,
          startTime: util.formatDateTime(activityInfo.startTime),
          endTime: util.formatDateTime(activityInfo.endTime),
          plantPointTotalNum: response.data.plantPointTotalNum,
          hasCollectPlantPointNum: response.data.hasCollectPlantPointNum
        })
      },
      fail: function(err) {
        console.log(err);
      }
    })
  }
})
