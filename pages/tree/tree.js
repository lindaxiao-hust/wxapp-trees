var util = require("../../utils/util.js")

Page({
  data: {
    plantImgs: [
      "http://7xsmkb.com1.z0.glb.clouddn.com/kakumon2.jpg",
      "http://7xsmkb.com1.z0.glb.clouddn.com/kakumon3.jpg",
      "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1487455584208&di=6c4bfa226385cf59fbd0a10944dc7d5c&imgtype=0&src=http%3A%2F%2Fimg1.gamersky.com%2Fimage2017%2F02%2F20170218_zl_91_8%2Fgamersky_03small_06_2017218205860A.jpg",
      "http://7xsmkb.com1.z0.glb.clouddn.com/kumamon1.jpeg"
    ],
    likeImg : "../../images/like.png",
    liked: false,
    currentDate: util.getCurrentDate()
  },
  like: function() {
    if(this.data.liked) {
      this.setData({
        likeImg: "../../images/like.png"
      })
      wx.showToast({
         title: "您不喜欢这棵树",
         icon: "success"
      })
    } else {
      this.setData({
        likeImg: "../../images/like_HL.png"
      })
      wx.showToast({
         title: "您喜欢这棵树",
         icon: "success"
      })
    }
    this.data.liked = !this.data.liked
  }
})
