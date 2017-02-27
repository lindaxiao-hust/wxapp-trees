var qcloud = require('../../bower_components/qcloud-weapp-client-sdk/index.js')
var config = require('../../config')
var util = require('../../utils/util.js')

var pageSize = config.pageSize//传给服务器的查询长度

Page({
  globalData: {
    startPos: 0,//传给服务器的查询起点
    init: true,//记录是否为第一次请求服务器
    messageTotalNum: 0,//记录每一次请求得到的消息数
    foreignId: 0,//消息对应的plantId/activityId/plantPointId，通过option获取
    type: 0//消息对应的类型，与foreignId对应，详见config.commentType，通过option获取
  },
  data: {
    loadmore: true,//是否正在加载
    loadend: false,//是否已全部加载完成
    loadFail: false,//是否加载失败
    messageInfoList: [],//记录每一次请求后的所有消息
    messageTotalNumInit: -1//记录第一次请求服务器后得到的消息数
  },
  onLoad: function(option) {
    console.log(option);
    this.globalData.foreignId = option.foreignId
    this.globalData.type = option.type
    this.requestMessage()
  },
  loadEnded: function() {
    return this.globalData.startPos + pageSize >= this.data.messageTotalNumInit ? true : false
  },
  requestMessage: function() {
    var that = this
    qcloud.request({
      login: true,
      url: config.service.messageRequestUrl + 'list',
      data: {
        foreignId: that.globalData.foreignId,
        type: that.globalData.type,
        startPos: that.globalData.startPos,
        pageSize: pageSize
      },
      success: function(response) {
        console.log(response);
        if(response.statusCode === 200) {
          that.globalData.messageTotalNum = response.data.messageTotalNum
          //记录下页面首次向服务器请求得到的列表长度
          if(that.globalData.init) {
            that.setData({
              messageTotalNumInit: that.globalData.messageTotalNum
            })
            that.globalData.init = false
          }
          var messageInfoListTmp = response.data.messageInfoList
          for(let index in messageInfoListTmp) {
            messageInfoListTmp[index].createTime = util.formatDateTime(messageInfoListTmp[index].createTime)
            messageInfoListTmp[index].picture = config.service.httpsHost + messageInfoListTmp[index].picture
          }
          that.setData({
            messageInfoList: that.data.messageInfoList.concat(messageInfoListTmp),
            loadend: that.loadEnded(),
            loadFail: false,
            loadmore: false
          })
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
  //上拉触底刷新
  onReachBottom: function() {
    //正在加载或已加载完时reachbottom无效
    if(this.data.loadmore === false && this.data.loadend === false) {
      //正在加载
      this.setData({
        loadmore: true,
        loadFail: false
      })

      //每次请求服务器要重新计算startPos，要注意减去新增的部分
      this.globalData.startPos = this.globalData.startPos + pageSize + this.globalData.messageTotalNum - this.data.messageTotalNumInit
      this.requestMessage()
    }
  },
  openActionSheet: function(e) {
    var that = this
    var userName = e.currentTarget.dataset.userName
    var userId = e.currentTarget.dataset.userId
    var actionTitle = "回复" + userName
    wx.showActionSheet({
      itemList: [actionTitle],
      success: function(res) {
        if (!res.cancel) {
          //选择回复，跳转到评论页面，带要回复的用户身份标识
          wx.navigateTo({
            url: '../comment/comment?foreignId=' + that.globalData.foreignId + '&type=' + that.globalData.type + '&toUserId=' + userId + '&toUserName=' + userName
          })
        }
      }
    });
  },
})
