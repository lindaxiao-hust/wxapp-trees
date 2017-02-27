var qcloud = require('../../bower_components/qcloud-weapp-client-sdk/index.js')
var config = require('../../config')
var util = require('../../utils/util.js')

var startPos = 0//传给服务器的查询起点
var pageSize = config.pageSize//传给服务器的查询长度
var init = true//记录是否为第一次请求服务器
var messageTotalNumInit = 0//记录第一次请求服务器后得到的消息数
var messageTotalNum = 0//记录每一次请求得到的消息数
var messageInfoList = []//记录每一次请求后的所有消息

var foreignId = 0//消息对应的plantId/activityId/plantPointId
var type = 0//消息对应的类型，与foreignId对应，详见config.commentType

Page({
  data: {
    loadmore: true,//是否正在加载
    loadend: false,//是否已全部加载完成
    loadFail: false,//是否加载失败
    messageTotalNumInit: -1
  },
  /**
  **  页面加载时向服务器请求消息列表
  **  option: 访问页面时所带的参数，包括
  **    foreignId: 消息对应的plantId/activityId/plantPointId
  **    type: 消息对应的类型，与foreignId对应，详见config.commentType
  **/
  onLoad: function(option) {
    console.log(option);
    //initialization
    startPos = 0
    init = true
    messageTotalNumInit = 0
    messageTotalNum = 0
    messageInfoList = []

    var that  = this
    foreignId = option.foreignId
    type = option.type
    this.requestMessage()
  },
  onReachBottom: function() {
    //正在加载或已加载完时reachbottom无效
    if(this.data.loadmore === false && this.data.loadend === false) {
      //正在加载
      this.setData({
        loadmore: true,
        loadFail: false
      })

      console.log('messageTotalNumInit:' + messageTotalNumInit);
      startPos = startPos + pageSize + messageTotalNum - messageTotalNumInit
      console.log(startPos);
      this.requestMessage()
    }
  },
  openActionSheet: function(e) {
    var userName = e.currentTarget.dataset.userName
    var userId = e.currentTarget.dataset.userId
    var actionTitle = "回复" + userName
    wx.showActionSheet({
      itemList: [actionTitle],
      success: function(res) {
        if (!res.cancel) {
          //选择回复，跳转到评论页面，带要回复的用户身份标识
          wx.navigateTo({
            url: '../comment/comment?userId=' + userId + '&userName=' + userName
          })
        }
      }
    });
  },
  loadEnded: function() {
    return startPos + pageSize >= messageTotalNum ? true : false
  },
  requestMessage: function() {
    console.log('request:'+startPos);
    var that = this
    qcloud.request({
      login: true,
      url: config.service.messageRequestUrl + 'list',
      data: {
        foreignId: foreignId,
        type: type,
        startPos: startPos,
        pageSize: pageSize
      },
      success: function(response) {
        console.log(response);
        messageTotalNum = response.data.messageTotalNum
        if(init) {
          messageTotalNumInit = messageTotalNum
          init = false
          that.setData({
            messageTotalNumInit: messageTotalNumInit
          })
        }
        var messageInfoListTmp = response.data.messageInfoList
        for(let index in messageInfoListTmp) {
          messageInfoListTmp[index].createTime = util.formatDateTime(messageInfoListTmp[index].createTime)
          messageInfoListTmp[index].picture = config.service.httpsHost + messageInfoListTmp[index].picture
        }
        messageInfoList = messageInfoList.concat(messageInfoListTmp)
        that.setData({
          messageInfoList: messageInfoList,
          loadend: that.loadEnded(),
          loadFail: false,
          loadmore: false
        })
      },
      fail: function(err) {
        console.log(err);
        that.setData({
          loadFail: true,
          loadmore: false
        })
      }
    })
  }
})
