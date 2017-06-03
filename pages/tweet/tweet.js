var qcloud = require('../../bower_components/qcloud-weapp-client-sdk/index.js')
var config = require('../../config')
var util = require('../../utils/util.js')

Page({
  globalData: {
    requestUrl: "",
    tweetImgUrls: []
  },
  data: {
    httpsHost: config.service.httpsHost,
    dataLoadStatus: 'loading', //判断页面数据是否加载状态
    defaultImg: config.defaultImg, // 默认图片
    defaultAudioPoster: config.defaultAudioPoster,
    commentType: config.commentType.commentTweet,
    tweetId: 0,
    audioAction: {
      method: 'pause'
    }
  },
  onLoad: function(option) {
    var that = this
    this.setData({
      tweetId: option.tweetId
    })
    qcloud.request({
      login: true,
      url: config.service.tweetRequestUrl + 'wxdetail?tweetId=' + option.tweetId,
      success: function(response) {
        console.log(response);
        if (response.statusCode === 200 && response.data.resultStatus === 'SUCCESS') {
          var tweetInfo = response.data.tweetInfo
          tweetInfo.createTime = util.formatDateTime(tweetInfo.createTime)

          var messageInfoCount = tweetInfo.messageInfoCount
          if(messageInfoCount > 0) {
            var messageInfo = tweetInfo.messageInfo
            messageInfo.createTime = util.formatDateTime(messageInfo.createTime)
            that.setData({
              messageInfo: messageInfo,
            })
          }

          tweetInfo.contents.forEach(function(tweetContent) {
            that.globalData.tweetImgUrls.push(that.data.httpsHost + tweetContent.img)
          })

          that.setData({
            dataLoadStatus: 'success',
            tweetInfo: tweetInfo,
            messageInfoCount: messageInfoCount,
            liked: tweetInfo.like,
            likesCount: tweetInfo.likeCount
          })
        } else {
          that.setData({
            dataLoadStatus: 'fail'
          })
        }
      },
      fail: function(err) {
        console.log(err);
        that.setData({
          dataLoadStatus: 'fail'
        })
      }
    })
  },
  onShow: function() {
    var that = this
    // 每次页面显示时都请求一次评论最新情况
    qcloud.request({
      login: true,
      url: config.service.messageRequestUrl + 'list',
      data: {
        foreignId: that.data.tweetId,
        type: that.data.commentType,
        startPos: 0,
        pageSize: 1
      },
      success: function(response) {
        console.log(response);
        if (response.statusCode === 200) {
          var messageInfoCount = response.data.messageTotalNum
          that.setData({
            messageInfoCount: messageInfoCount
          })

          if (messageInfoCount > 0) {
            var messageInfo = response.data.messageInfoList[0]
            messageInfo.createTime = util.formatDateTime(messageInfo.createTime)
            that.setData({
              messageInfo: response.data.messageInfoList[0]
            })
          }
        }
      },
      fail: function(err) {
        console.log(err);
      }
    })
  },
  like: function() {
    var that = this
    var likesCount = 0 //记录点赞数
    var originLikesCount = this.data.likesCount //记录原始点赞数，给用户数据即时变化的感觉
    //对点赞的处理基于当前的点赞状态
    if (this.data.liked) {
      //取消赞
      this.globalData.requestUrl = config.service.likesRequestUrl + 'cancel'
      likesCount = this.data.likesCount - 1 //点赞数即时变化
    } else {
      //点赞
      this.globalData.requestUrl = config.service.likesRequestUrl + 'add'
      likesCount = this.data.likesCount + 1 //点赞数即时变化
    }
    this.setData({
      liked: !this.data.liked, //点赞状态即时变化
      likesCount: likesCount //点赞数即时变化
    })
    //与服务器进行交互
    qcloud.request({
      login: true,
      url: this.globalData.requestUrl,
      data: {
        foreignId: this.data.tweetInfo.tweetId,
        likesType: config.likesType.likeTweet
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      success: function(res) {
        console.log(res.data);
        wx.showToast({
          title: res.data.resultMsg,
          icon: "success"
        })
      },
      fail: function(err) {
        console.log(err);
        wx.showToast({
          title: err,
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
  showTweetImgs: function(event) {
    wx.previewImage({
      current: event.currentTarget.dataset.imgUrl,
      urls: this.globalData.tweetImgUrls,
      fail: function() {
        wx.showToast({
          title: '加载图片失败',
          icon: 'warn'
        })
      }
    })
  }
})
