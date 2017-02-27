var qcloud = require("../../bower_components/qcloud-weapp-client-sdk/index.js")
var config = require("../../config")
var util = require("../../utils/util.js")

/**
**  进入该页面有两种方式
**  1. 带活动: pages/tree/tree?plant_id=plantId&activity_id=activityId
**  2. 不带活动: pages/tree/tree?plant_id=plantId
**/

//模拟扫码链接，pages/tree/tree?plant_id=plantId&activity_id=activityId
var plantId = 253
var activityId = 6

var plantInfos = null//服务器返回的植物相关信息
var requestUrl, successMsg, failMsg//请求地址，服务器返回的成功信息，服务器返回的失败信息
var plantImgUrls = []//当前植物的图片地址列表

Page({
  data: {
    host: 'https://' + config.service.host,
    dataLoadStatus: 'loading',//判断页面数据是否加载状态
    plantImgs: [],//当前植物的图片列表
    currentDate: util.getCurrentDate(),
    tweetInfoList: []
  },
  onLoad: function(option) {
    console.log(option);
    var that = this
    qcloud.request({
      login: true,
      url: config.service.plantRequestUrl + "inactivity/pid=" + plantId + "&aid=" + activityId,
      success: function(response) {
        console.log(response)
        if(response.statusCode === 200) {
          plantInfos = response.data
          //导出图片链接数组
          var pictures = plantInfos.plantInfo.pictures
          for(let index in pictures) {
            plantImgUrls.push(that.data.host + pictures[index].pictureName)
          }
          that.setData({
            activityId: activityId,
            plantId: plantId,
            dataLoadStatus: 'success',
            //plantInfos
            hasCollectPlantPointNum: plantInfos.hasCollectPlantPointNum,
            plantPointTotalNum: plantInfos.plantPointTotalNum,
            liked: plantInfos.isLike,
            likesCount: plantInfos.likesCount,
            //plantInfo
            treeInfo: JSON.stringify(plantInfos.plantInfo),
            plantImgs: pictures,
            species: plantInfos.plantInfo.species,
            feature: plantInfos.plantInfo.feature,
            messageInfoCount: plantInfos.messageInfoCount,
            //commentInfo
            foreignId: plantInfos.plantPoint.plantPointId,
            type: config.commentType.commentPlantPoint
          })
        } else {
          that.setData({
            dataLoadStatus: 'fail'
          })
        }
      },
      fail: function(err) {
        console.log(err)
        that.setData({
          dataLoadStatus: 'fail'
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
        'content-type': 'application/json'
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
      urls: plantImgUrls
    })
  }
})
