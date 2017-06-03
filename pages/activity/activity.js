var qcloud = require("../../bower_components/qcloud-weapp-client-sdk/index.js")
var config = require("../../config.js")
var util = require("../../utils/util.js")
// map
// 引入SDK核心类
var QQMapWX = require('../../libs/js/qqmap-wx-jssdk.js');
// 实例化API核心类
var qqMapWX = new QQMapWX({
  key: 'WHABZ-IVTCJ-5JSFC-FWHSB-LIUCK-GFBFA'
});

Page({
  globalData: {
    requestUrl: '',
    geocoderRes: {} // 地址解析的结果
  },
  data: {
    httpsHost: config.service.httpsHost,
    defaultImg: config.defaultImg,
    dataLoadStatus: 'loading', //判断页面数据是否加载状态
    commentType: config.commentType.commentActivity,
    liked: false, //记录点赞状态
    activityId: 0,
    currentDate: util.getCurrentDate(),
    map: ''
  },
  onLoad: function(option) {
    console.log(option);
    //从跳转链接参数中获取activityId
    this.setData({
      activityId: option.activityId
    })
    var that = this
    qcloud.request({
      login: true,
      url: config.service.activityRequestUrl + 'detail/aid=' + option.activityId,
      success: function(response) {
        console.log(response);
        if (response.statusCode === 200) {
          var activityInfo = response.data.activityInfo
          var plantPointInfoList = response.data.plantPointInfoList
          // //如果植物没有图片则将其置为空
          // for (let index in plantPointInfoList) {
          //   if (typeof plantPointInfoList[index].plantPic === "undefined") {
          //     plantPointInfoList[index].plantPic = ''
          //   } else {
          //     plantPointInfoList[index].plantPic = that.data.host + plantPointInfoList[index].plantPic
          //   }
          // }

          // 地址解析
          qqMapWX.geocoder({
            address: activityInfo.location,
            success: function(res) {
              console.log(res);
              that.globalData.geocoderRes = res
            },
            fail: function(res) {
              console.log(res);
              that.globalData.geocoderRes = res
            },
            complete: function(res) {
              that.setData({
                activityInfo: activityInfo,
                startTime: util.formatDateTime(activityInfo.startTime),
                endTime: util.formatDateTime(activityInfo.endTime),
                plantPointTotalNum: response.data.plantPointTotalNum,
                hasCollectPlantPointNum: response.data.hasCollectPlantPointNum,
                plantPointInfoList: plantPointInfoList,
                messageInfoCount: response.data.messageInfoCount,
                dataLoadStatus: 'success',
                map: config.service.httpsHost + activityInfo.mapName,
                //like
                liked: response.data.isLike,
                likesCount: response.data.likesCount,
                participatorNum: response.data.participatorNum
              })
            }
          });
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
        foreignId: that.data.activityId,
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
      this.globalData.successMsg = "成功取消此赞"
      this.globalData.failMsg = "取消此赞失败"
      likesCount = this.data.likesCount - 1 //点赞数即时变化
    } else {
      //点赞
      this.globalData.requestUrl = config.service.likesRequestUrl + 'add'
      this.globalData.successMsg = "成功点赞"
      this.globalData.failMsg = "点赞失败"
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
        foreignId: this.data.activityId,
        likesType: config.likesType.likeActivity
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
  previewMap: function() {
    wx.previewImage({
      urls: [this.data.map],
      fail: function() {
        wx: showToast({
          title: '图片预览失败',
          icon: 'warn'
        })
      }
    })
  },
  showLocation: function() {
    console.log(this.globalData.geocoderRes);
    var locationInfo = this.globalData.geocoderRes.result
    if(this.globalData.geocoderRes.status === 0) {
      wx.openLocation({
        latitude: locationInfo.location.lat,
        longitude: locationInfo.location.lng,
        // scale: 5,
        name: locationInfo.title,
        address: this.data.activityInfo.location
      })
    } else {
      wx.showToast({
        title: this.globalData.geocoderRes.message,
        image: '../../images/wechat.png'
      })
    }

  }
})
