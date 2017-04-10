var app = getApp()
Page({
  onLoad: function(option) {
    this.setData({
      // tweetLink: option.tweetLink
      tweetLink: app.globalData.tweetUrl
    })
  }
})
