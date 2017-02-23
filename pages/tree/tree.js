var qcloud = require("../../bower_components/qcloud-weapp-client-sdk/index.js")
var config = require("../../config")
var util = require("../../utils/util.js")

//模拟扫码链接，pages/tree/tree?plant_id=plantId&activity_id=activityId
var plantId = 253
var activityId = 6

var plantInfos = null
var likesType = 0

Page({
  data: {
    plantImgs: [],//当前植物的图片列表
    currentDate: util.getCurrentDate(),
    tweetInfoList: []
  },
  onLoad: function() {
    var that = this
    qcloud.request({
      login: true,
      url: config.service.plantRequestUrl + "inactivity/pid=" + plantId + "&aid=" + activityId,
      success: function(response) {
        console.log(response)
        plantInfos = response.data
        that.setData({
          activityId: activityId,
          hasCollectPlantPointNum: plantInfos.hasCollectPlantPointNum,
          plantPointTotalNum: plantInfos.plantPointTotalNum,
          liked: plantInfos.isLike,
          likesCount: plantInfos.likesCount,
          //plantInfo
          treeInfo: JSON.stringify(plantInfos.plantInfo),
          plantImgs: plantInfos.plantInfo.pictureLinks,
          species: plantInfos.plantInfo.species,
          feature: plantInfos.plantInfo.feature
        })
      },
      fail: function(err) {
        console.log(err)
      }
    })
  },
  like: function() {
    if(this.data.liked) {
      wx.showToast({
         title: "您不喜欢这棵树",
         icon: "success"
      })
      //取消赞
      console.log(plantInfos.plantPoint.plantPointId);
      console.log(config.likesType.likePlantPoint);
      qcloud.request({
        login: true,
        url: config.service.likesRequestUrl + 'cancel',
        data: {
          foreignId: plantInfos.plantPoint.plantPointId,
          likesType: config.likesType.likePlantPoint
        },
        header: {
          'content-type': config.requestHeader
        },
        method: 'POST',
        success: function(res) {
          console.log(res.data);
        },
        fail: function(err) {
          console.log(err);
        }
      })
    } else {
      wx.showToast({
         title: "您喜欢这棵树",
         icon: "success"
      })
      //点赞
      console.log(plantInfos.plantPoint.plantPointId);
      console.log(config.likesType.likePlantPoint);
      qcloud.request({
        login: true,
        url: config.service.likesRequestUrl + 'add',
        data: {
          foreignId: plantInfos.plantPoint.plantPointId,
          likesType: config.likesType.likePlantPoint
        },
        header: {
          'content-type': config.requestHeader
        },
        method: 'POST',
        success: function(res) {
          console.log(res.data);
        },
        fail: function(err) {
          console.log(err);
        }
      })
    }
    this.setData({
      liked: !this.data.liked
    })
  },
  showPlantImgs: function() {
    wx.previewImage({
      // current: 'String', // 当前显示图片的链接，不填则默认为 urls 的第一张
      urls: this.data.plantImgs,
    })
  }
})
