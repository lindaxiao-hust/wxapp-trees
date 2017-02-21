Page({
  data: {
    imageList: []
  },
  chooseImage: function() {
    var that = this
    wx.chooseImage({
      count: 1,//限定评论最多只能添加一张图片
      success: function(res) {
        //返回选定照片的本地文件路径列表
        that.setData({
          imageList: that.data.imageList.concat(res.tempFilePaths)
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
  bindTextAreaBlur: function(e) {
    console.log(e.detail.value);
  },
  clearImg: function(e) {
    this.data.imageList.splice(e.target.dataset.imgIndex, 1)
    this.setData({
      imageList:  this.data.imageList
    })
  }
})
