var qcloud = require("../../bower_components/qcloud-weapp-client-sdk/index.js")
var config = require("../../config")
var util = require("../../utils/util.js")
var app = getApp()

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
    activityId: 0,//活动id，由链接参数获取
    loadEnd: false, // 记录初次加载是否完成
    plantImgsAll: [],//当前植物的图片列表
  },
  data: {
    httpsHost: config.service.httpsHost,
    defaultImg: config.defaultImg,
    dataLoadStatus: 'loading',//判断页面数据是否加载状态
    plantId: 0,//植物id，由链接参数获取
    plantImgs: [],//取植物的图片列表前三张显示在首页
    currentDate: util.getCurrentDate(),
    tweetInfoList: [],
    plantInActivity: true,//当前植物是否参加活动
    liked: false,//记录点赞状态
    foreignId: 0,//点赞/评论对应的plantId/activityId/plantPointId
    likeType: 0,//点赞对应的类型，与foreignId对应，详见config.commentType
    commentType: 0,//评论对应的类型，与foreignId对应，详见config.commentType
    uncollected: false, //用户是否第一次收集该植物
    returnHome: false // 是否添加回首页入口
  },
  onLoad: function(option) {
    console.log('getCurrentPages():'+getCurrentPages().length);

    this.setData({
      plantId: option.plant_id
    })
    if(getCurrentPages().length === 1 || option.scanCode)
    this.setData({
      returnHome: true
    })

    if(option.activity_id === undefined) {
      //不带活动，纯plant
      this.globalData.requestUrl = config.service.plantRequestUrl + "notactivity/pid=" + this.data.plantId
      this.setData({
        plantInActivity: false,
        foreignId: this.data.plantId,
        likeType: config.likesType.likePlant,
        commentType: config.commentType.commentPlant
      })
    } else {
      //带活动
      this.globalData.activityId = option.activity_id
      this.globalData.requestUrl = config.service.plantRequestUrl + "inactivity/pid=" + this.data.plantId + "&aid=" + this.globalData.activityId
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
          for(let index in pictures) {
            that.globalData.plantImgsAll.push(that.data.httpsHost + pictures[index].pictureName)
          }
          var tweetInfoList = plantInfos.tweetInfoList
          tweetInfoList.forEach(function(tweet) {
            tweet.createTime = util.formatDateTime(tweet.createTime)
          })
          that.setData({
            // dataLoadStatus: 'success',
            //like
            liked: plantInfos.isLike,
            likesCount: plantInfos.likesCount,
            //plantInfo
            // treeInfo: JSON.stringify(plantInfos.plantInfo),
            plantImgs: that.globalData.plantImgsAll.slice(0, 3),
            species: plantInfos.plantInfo.species,
            intro: plantInfos.plantInfo.intro,
            //commentInfo
            messageInfoCount: plantInfos.messageInfoCount,
            //tweet
            tweetInfoList: tweetInfoList
          })
          if(that.data.plantInActivity) {
            that.setData({
              activityId: that.globalData.activityId,
              //plantInfosInActivity
              hasCollectPlantPointNum: plantInfos.hasCollectPlantPointNum,
              plantPointTotalNum: plantInfos.plantPointTotalNum,
              activityInfo: plantInfos.activityInfo,
              //comment like
              foreignId: plantInfos.plantPoint.plantPointId,
              likeType: config.likesType.likePlantPoint,
              commentType: config.commentType.commentPlantPoint,
            })
            // 当前植物参加活动，且为第一次收集
            if(response.data.resultStatus !== "HASCOLLECT") {
              that.setData({
                uncollected: true
              })
            }
          }
          that.getMessage(that)
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
  onShow: function() {
    // 每次页面显示时都请求一次评论最新情况
    if(this.globalData.loadEnd) {
      this.getMessage(this)
    }
  },
  getMessage: function(that) {
    qcloud.request({
      login: true,
      url: config.service.messageRequestUrl + 'list',
      data: {
        foreignId: that.data.foreignId,
        type: that.data.commentType,
        startPos: 0,
        pageSize: 1
      },
      success: function(response) {
        console.log(response);
        if(response.statusCode === 200) {
          var messageInfoCount = response.data.messageTotalNum
          that.setData({
            dataLoadStatus: 'success',
            messageInfoCount: messageInfoCount
          })

          if(messageInfoCount > 0) {
            var messageInfo = response.data.messageInfoList[0]
            messageInfo.createTime = util.formatDateTime(messageInfo.createTime)
            that.setData({
              messageInfo: response.data.messageInfoList[0]
            })
          }

          // todo 若第一次收集植物，响提示音
          if(that.data.uncollected) {
            that.ding()
          }
        }
      },
      fail: function(err) {
        console.log(err);
        that.setData({
          dataLoadStatus: 'fail'
        })
      },
      complete: function() {
        that.globalData.loadEnd = true
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
  showPlantImgs: function(event) {
    wx.previewImage({
      current: event.currentTarget.dataset.imgUrl,
      urls: this.globalData.plantImgsAll,
      fail: function() {
        wx.showToast({
          title: '加载图片失败',
          icon: 'warn'
        })
      }
    })
  },
  goTip: function(e) {
    app.globalData.tweetUrl = this.data.tweetInfoList[e.currentTarget.dataset.idx].tweetLink
    wx.navigateTo({
      url: "../tip/tip"
    })
  },
  ding: function() {
    wx.playBackgroundAudio({
      dataUrl: config.defaultDing,
      title: '成功收集植物提示音',
      coverImgUrl: ''
    })
  },
  collect: function() {
    // 停止音效播放
    wx.stopBackgroundAudio()
    // 将状态改为已收集该植物
    this.setData({
      uncollected: !this.data.uncollected
    })
  },
  // 返回上一页的同时关闭声音，该页面需要判断当前页数是否为1，若为1跳转到首页
  onHide: function() {
    // 停止音效播放
    wx.stopBackgroundAudio()
  },
  onUnload: function() {
    // 停止音效播放
    wx.stopBackgroundAudio()
  }
})
