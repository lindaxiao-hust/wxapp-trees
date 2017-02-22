var qcloud = require("../../bower_components/qcloud-weapp-client-sdk/index.js")
var config = require("../../config.js")
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
    currentDate: util.getCurrentDate(),
    //模拟扫码链接，pages/tree/tree?plant_id=plantId&activity_id=activityId
    plantId: 253,
    activityId: 6
  },
  onLoad: function() {
    qcloud.request({
      login: true,
      url: config.service.plantRequestUrl + "inactivity/pid=" + this.data.plantId + "&aid=" + this.data.activityId,
      success: function(response) {
        console.log(response)
      },
      fail: function(err) {
        console.log(err)
      }
    })
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
  },
  openActionSheet: function(e) {
    console.log(e)
    wx.showActionSheet({
        itemList: ['回复'],
        success: function(res) {
            if (!res.cancel) {
              //选择回复，跳转到评论页面，带要回复的用户身份标识
                console.log(res.tapIndex)
            }
        }
    });
  }
})
