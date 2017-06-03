var app = getApp()
Page({
  onLoad: function(option) {
    // this.setData({
    //   // tweetLink: option.tweetLink
    //   tweetLink: app.globalData.tweetUrl
    // })
  },
  previewQrcode: function() {
    wx.previewImage({
      urls: ['http://7xsmkb.com1.z0.glb.clouddn.com/mumumdmd.png'],
      fail: function() {
        wx:showToast({
          title: '图片预览失败',
          icon: 'warn'
        })
      }
    })
  }
})
