var qcloud = require('../../bower_components/qcloud-weapp-client-sdk/index.js')
var config = require('../../config')
var util = require('../../utils/util.js')

var pageSize = config.pageSize //传给服务器的查询长度
var app = getApp()
Page({
  globalData: {
    startPos: 0, //传给服务器的查询起点
    init: true, //记录是否为第一次请求服务器
    tweetTotalNum: 0, //记录每一次请求得到的推文数
    plantId: 0 //该页面对应的植物id，通过option获取
  },
  data: {
    httpsHost: config.service.httpsHost,
    defaultImg: config.defaultImg,
    loadmore: true, //是否正在加载
    loadend: false, //是否已全部加载完成
    loadFail: false, //是否加载失败
    tweetInfoList: [], //记录每一次请求后的所有推文
    tweetTotalNumInit: -1 //记录第一次请求服务器后得到的推文数
  },
  onLoad: function(option) {
    console.log(option);
    this.globalData.plantId = option.plantId
    //向服务器请求推文列表
    this.requestTweet()
  },
  //判断所有推文是否都已加载
  loadEnded: function() {
    console.log('this.globalData.startPos:' + this.globalData.startPos);
    console.log('this.globalData.tweetTotalNumInit:' + this.data.tweetTotalNumInit);
    return this.globalData.startPos + pageSize >= this.data.tweetTotalNumInit ? true : false
  },
  requestTweet: function() {
    var that = this
    var requestTweetUrl = ''
    var requestTweetData = {
      startPos: that.globalData.startPos,
      pageSize: pageSize
    }
    // 获取所有推文（首页）
    if(this.globalData.plantId === undefined) {
      requestTweetUrl = config.service.recommendRequestUrl + 'tweet'
    } else {
      // 获取植物相关推文
      requestTweetUrl = config.service.tweetRequestUrl + 'wxlist'
      requestTweetData['plantId'] = that.globalData.plantId
    }
    qcloud.request({
      login: true,
      url: requestTweetUrl,
      data: requestTweetData,
      success: function(response) {
        console.log(response);
        if (response.statusCode === 200) {
          that.globalData.tweetTotalNum = response.data.tweetTotalNum
          //记录下页面首次向服务器请求得到的列表长度
          if (that.globalData.init) {
            that.setData({
              tweetTotalNumInit: that.globalData.tweetTotalNum
            })
            that.globalData.init = false
          }
          var tweetInfoListTmp = response.data.tweetInfoList
          for (let index in tweetInfoListTmp) {
            tweetInfoListTmp[index].createTime = util.formatDateTime(tweetInfoListTmp[index].createTime)
          }
          that.setData({
            tweetInfoList: that.data.tweetInfoList.concat(tweetInfoListTmp),
            loadend: that.loadEnded(),
            loadFail: false,
            loadmore: false
          })
          console.log(that.data.loadend);
        } else {
          //非200的情况，如400,500，可加弹窗提示错误类型
          that.setData({
            loadFail: true,
            loadmore: false
          })
        }
      },
      fail: function(err) {
        console.log(err);
        that.setData({
          loadFail: true,
          loadmore: false
        })
      }
    })
  },
  onReachBottom: function() {
    //正在加载或已加载完时reachbottom无效
    if (this.data.loadmore === false && this.data.loadend === false) {
      // 若继续请求服务器要重新计算startPos，要注意减去新增的部分
      if (this.data.loadFail === false) {
        this.globalData.startPos = this.globalData.startPos + pageSize + this.globalData.tweetTotalNum - this.data.tweetTotalNumInit
      }

      //正在加载
      this.setData({
        loadmore: true,
        loadFail: false
      })

      this.requestTweet()
    }
  },
  goTip: function(e) {
    app.globalData.tweetUrl = this.data.tweetInfoList[e.currentTarget.dataset.idx].tweetLink
    // console.log(app.globalData.tweetUrl);
    wx.navigateTo({
      url: "../tip/tip"
    })
  }
})
