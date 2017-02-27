Page({
  onLoad: function(option) {
    console.log(option);
    this.setData({
      tweetLink: option.tweetLink
    })
  }
})
