var util = require('../../utils/util.js')
var config = require('../../config')
var qcloud = require('../../bower_components/qcloud-weapp-client-sdk/index.js')

var foreignId = 0//评论对象的id


Page({
  globalData: {
    foreignId: 0,//评论对应的plantId/activityId/plantPointId
    type: 0,//评论对应的类型，与foreignId对应，详见config.commentType
    toUserId: 0,//回复的用户ID
    requestUrl: '',//请求地址
    loadingMsg: '',//加载信息
    successMsg: '',//服务器返回的成功信息
    failMsg: '',//服务器返回的失败信息
    reply: false//记录当前为评论还是回复
  },
  data: {
    imageList: [],
    placeholder: ''//评论内容提示
  },
  onLoad: function(option) {
    console.log(option)
    // if(!util.isObjOwnEmpty(option)) {
    //   wx.setNavigationBarTitle({
    //     title: '回复'+option.userName
    //   })
    // }
    this.globalData.foreignId = option.foreignId
    this.globalData.type = option.type
    //评论
    if(option.toUserId === undefined) {
      this.globalData.requestUrl = config.service.messageRequestUrl + 'add'
      this.globalData.successMsg = '评论成功'
      this.globalData.failMsg = '评论失败'
      this.globalData.loadingMsg = '评论上传中'
    } else {
      //回复
      this.globalData.requestUrl = config.service.messageRequestUrl + 'reply'
      this.globalData.toUserId = option.toUserId
      this.globalData.successMsg = '回复成功'
      this.globalData.failMsg = '回复失败'
      this.globalData.loadingMsg = '回复上传中'
      this.globalData.reply = true
    }
  },
  chooseImage: function() {
    var that = this
    wx.chooseImage({
      count: 1,//限定评论最多只能添加一张图片
      success: function(res) {
        //返回选定照片的本地文件路径列表
        that.setData({
          imageList: res.tempFilePaths
        })
      }
    })
  },
  previewImage: function(e) {
    var current = e.target.dataset.src
    wx.previewImage({
      current: current, // 当前显示图片的链接，不填则默认为 urls 的第一张
      urls: this.data.imageList
    })
  },
  clearImg: function(e) {
    this.data.imageList.splice(e.target.dataset.imgIndex, 1)
    this.setData({
      imageList:  this.data.imageList
    })
  },
  formSubmit: function(e) {
    var that = this
    console.log('form发生了submit事件，携带数据为：', e.detail.value.textarea)
    console.log(this.data.imageList)
    if(e.detail.value.textarea === "" && this.data.imageList.length === 0) {
      wx.showModal({
        content: '请填写内容',
        showCancel: false
      })
    } else {
      wx.showToast({
        title: that.globalData.loadingMsg,
        icon: 'loading',
        duration: 10000
      })
      qcloud.request({
        login: true,
        url: config.service.userRequestUrl + 'getinfo',
        success: function(response) {
          console.log(response);
          var openId = response.data.data.userInfo.openId
          //提交的数据
          var formData = {
            foreignId: that.globalData.foreignId,
            type: that.globalData.type,
            messageContent: encodeURI(e.detail.value.textarea),
            openId: openId
          }
          if(that.globalData.reply) {
            formData.toUserId = that.globalData.toUserId
          }
          wx.uploadFile({
            url: that.globalData.requestUrl,
            filePath: that.data.imageList[0],
            name:'msgPic',
            formData: formData,
            success: function(res){
              console.log(res);
              wx.showToast({
                title: that.globalData.successMsg,
                icon: 'success'
              })
              wx.redirectTo({
                url: '../comments/comments?foreignId=' + that.globalData.foreignId + '&type=' + that.globalData.type,
                fail: function(err) {
                  wx.showToast({
                    title: '跳转页面失败' + err,
                    icon: 'warn'
                  })
                }
              })
            },
            fail: function(err) {
              console.log(err);
              wx.showToast({
                title: that.globalData.failMsg,
                icon: 'warn'
              })
            }
          })
        },
        fail: function(err) {
          console.log(err);
          wx.showToast({
            title: '连接服务器失败',
            icon: 'warn'
          })
        }
      })
    }
  }
})
