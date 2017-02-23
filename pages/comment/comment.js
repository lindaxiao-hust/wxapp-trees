var util = require('../../utils/util.js')

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
    console.log('form发生了submit事件，携带数据为：', e.detail.value.textarea)
    console.log(this.data.imageList)
    if(e.detail.value.textarea === "" && this.data.imageList.length === 0) {
      console.log("请填写评论内容")
    } else {
      
    }
  }
})
