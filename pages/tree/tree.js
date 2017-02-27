var qcloud = require("../../bower_components/qcloud-weapp-client-sdk/index.js")
var config = require("../../config")
var util = require("../../utils/util.js")

/**
**  进入该页面有两种方式
**  1. 带活动: pages/tree/tree?plant_id=plantId&activity_id=activityId
**  2. 不带活动: pages/tree/tree?plant_id=plantId
**/


Page({
  globalData: {
    requestUrl: '',//请求地址
    successMsg: '',//服务器返回的成功信息
    failMsg: '',//服务器返回的失败信息
    plantId: 0,//植物id，由链接参数获取
    activityId: 0,//活动id，由链接参数获取
  },
  data: {
    host: config.service.httpsHost,
    dataLoadStatus: 'loading',//判断页面数据是否加载状态
    plantImgs: [],//当前植物的图片列表
    currentDate: util.getCurrentDate(),
    tweetInfoList: [],
    plantInActivity: true,//当前植物是否参加活动
    liked: false,//记录点赞状态
    foreignId: 0,//点赞/评论对应的plantId/activityId/plantPointId
    likeType: 0,//点赞对应的类型，与foreignId对应，详见config.commentType
    commentType: 0,//评论对应的类型，与foreignId对应，详见config.commentType
  },
  onLoad: function(option) {
    console.log(option);
    this.globalData.plantId = option.plant_id

    if(option.activity_id === undefined) {
      //不带活动，纯plant
      this.globalData.requestUrl = config.service.plantRequestUrl + "notactivity/pid=" + this.globalData.plantId
      this.setData({
        plantInActivity: false,
        foreignId: this.globalData.plantId,
        likeType: config.likesType.likePlant,
        commentType: config.commentType.commentPlant
      })
    } else {
      //带活动
      this.globalData.activityId = option.activity_id
      this.globalData.requestUrl = config.service.plantRequestUrl + "inactivity/pid=" + this.globalData.plantId + "&aid=" + this.globalData.activityId
    }

    var that = this
    qcloud.request({
      login: true,
      url: that.globalData.requestUrl,
      success: function(response) {
        console.log(response)
        if(response.statusCode === 200) {
          var plantInfos = response.data
          //导出图片链接数组
          var pictures = plantInfos.plantInfo.pictures
          var picturesTmp = []
          for(let index in pictures) {
            picturesTmp.push(that.data.host + pictures[index].pictureName)
          }
          that.setData({
            plantId: that.globalData.plantId,
            dataLoadStatus: 'success',
            //like
            liked: plantInfos.isLike,
            likesCount: plantInfos.likesCount,
            //plantInfo
            treeInfo: JSON.stringify(plantInfos.plantInfo),
            plantImgs: picturesTmp,
            species: plantInfos.plantInfo.species,
            feature: plantInfos.plantInfo.feature,
            //commentInfo
            messageInfoCount: plantInfos.messageInfoCount,
            //tweet
            tweetInfoList: plantInfos.tweetInfoList
          })
          if(that.data.plantInActivity) {
            that.setData({
              activityId: that.globalData.activityId,
              //plantInfosInActivity
              hasCollectPlantPointNum: plantInfos.hasCollectPlantPointNum,
              plantPointTotalNum: plantInfos.plantPointTotalNum,
              //comment like
              foreignId: plantInfos.plantPoint.plantPointId,
              likeType: config.likesType.likePlantPoint,
              commentType: config.commentType.commentPlantPoint,
            })
          }
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
    var that = this
    var likesCount = 0//记录点赞数
    var originLikesCount = this.data.likesCount//记录原始点赞数，给用户数据即时变化的感觉
    //对点赞的处理基于当前的点赞状态
    if(this.data.liked) {
      //取消赞
      this.globalData.requestUrl = config.service.likesRequestUrl + 'cancel'
      this.globalData.successMsg = "成功取消此赞"
      this.globalData.failMsg = "取消此赞失败"
      likesCount = this.data.likesCount - 1//点赞数即时变化
    } else {
      //点赞
      this.globalData.requestUrl = config.service.likesRequestUrl + 'add'
      this.globalData.successMsg = "成功点赞"
      this.globalData.failMsg = "点赞失败"
      likesCount = this.data.likesCount + 1//点赞数即时变化
    }
    this.setData({
      liked: !this.data.liked,//点赞状态即时变化
      likesCount: likesCount//点赞数即时变化
    })
    //与服务器进行交互
    qcloud.request({
      login: true,
      url: this.globalData.requestUrl,
      data: {
        foreignId: this.data.foreignId,
        likesType: this.data.likeType
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      success: function(res) {
        console.log(res.data);
        wx.showToast({
           title: that.globalData.successMsg,
           icon: "success"
        })
      },
      fail: function(err) {
        console.log(err);
        wx.showToast({
          title: that.globalData.failMsg,
          icon: "warn"
        })
        //点赞失败还原点赞状态
        that.setData({
          liked: !that.data.liked,
          likesCount: originLikesCount
        })
      }
    })
  },
  showPlantImgs: function() {
    wx.previewImage({
      urls: this.data.plantImgs,
      fail: function() {
        wx.showToast({
          title: '加载图片失败',
          icon: 'warn'
        })
      }
    })
  }
})
