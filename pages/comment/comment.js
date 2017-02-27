var util = require('../../utils/util.js')
var config = require('../../config')
var qcloud = require('../../bower_components/qcloud-weapp-client-sdk/index.js')

var foreignId = 0//评论对象的id


Page({
  data: {
    imageList: []
  },
  onLoad: function(option) {
    console.log(option)
    if(!util.isObjOwnEmpty(option)) {
      wx.setNavigationBarTitle({
        title: '回复'+option.userName
      })
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
  // bindTextAreaInput: function(e) {
  //   console.log(e.detail.value);
  // },
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
      console.log("请填写评论内容")
    } else {
      console.log(config.service.messageRequestUrl + 'add');
      qcloud.request({
        login: true,
        url: config.service.userRequestUrl + 'getinfo',
        success: function(response) {
          console.log(response);
          var openId = response.data.data.userInfo.openId
          wx.uploadFile({
            url: config.service.messageRequestUrl + 'reply',
            filePath: that.data.imageList[0],
            name:'msgPic',
            formData: {
              foreignId: 1,
              type: 0,
              messageContent: encodeURI(e.detail.value.textarea),
              openId: openId,
              toUserId: 1
            },
            success: function(res){
              console.log(res);
              wx.showToast({
                title: '成功上传文件',
                icon: 'success'
              })
            },
            fail: function(err) {
              console.log(err);
              wx.showToast({
                title: '上传文件失败',
                icon: 'warn'
              })
            },
            complete: function() {
              // complete
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
