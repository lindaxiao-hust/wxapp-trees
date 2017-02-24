var qcloud = require("../../bower_components/qcloud-weapp-client-sdk/index.js")
var config = require("../../config")
var util = require("../../utils/util.js")

//模拟扫码链接，pages/tree/tree?plant_id=plantId&activity_id=activityId
var plantId = 253
var activityId = 6

var plantInfos = null
var likesType = 0
var requestUrl, successMsg, failMsg

Page({
  data: {
    dataLoaded: false,//判断页面数据是否成功加载
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
      },
      complete: function() {
        that.setData({
          dataLoaded: true
        })
      }
    })
  },
  //点赞的处理
  like: function() {
    this.setData({
      liked: !this.data.liked
    })
    //对点赞的处理基于当前的点赞状态
    console.log(plantInfos.plantPoint.plantPointId);
    console.log(config.likesType.likePlantPoint);
    if(plantInfos.isLike) {
      //取消赞
      requestUrl = config.service.likesRequestUrl + 'cancel'
      successMsg = "成功取消此赞"
      failMsg = "取消此赞失败"
    } else {
      requestUrl = config.service.likesRequestUrl + 'add'
      successMsg = "成功点赞"
      failMsg = "点赞失败"
    }
    //与服务器进行交互
    qcloud.request({
      login: true,
      url: requestUrl,
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
        wx.showToast({
           title: successMsg,
           icon: "success"
        })
      },
      fail: function(err) {
        console.log(err);
        wx.showToast({
          title: failMsg,
          icon: "warn"
        })
        this.setData({
          liked: !this.data.liked
        })
      }
    })
  },
  showPlantImgs: function() {
    wx.previewImage({
      // current: 'String', // 当前显示图片的链接，不填则默认为 urls 的第一张
      urls: this.data.plantImgs,
    })
  }
})
