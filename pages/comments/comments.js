/**
  点击图片放大（可搁置
  @mention
  添加评论
  回复评论
**/
Page({
  data: {
    comments: [
      {
        id: 0,
        avatarUrl: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1487455584208&di=6c4bfa226385cf59fbd0a10944dc7d5c&imgtype=0&src=http%3A%2F%2Fimg1.gamersky.com%2Fimage2017%2F02%2F20170218_zl_91_8%2Fgamersky_03small_06_2017218205860A.jpg",
        username: "0test测试测试测试测试test测试测试测试测试test测",
        date: "2017/02/20 11:27",
        content: "aaatest测试测试测试测试测试测试测试测试测试测试aaatest测试测试测试测试测试测试测试测试测试测试",
        imgSrc: null
      },
      {
        id: 1,
        avatarUrl: "http://7xsmkb.com1.z0.glb.clouddn.com/kakumon2.jpg",
        username: "1test测试测试测试测试",
        date: "2017/02/20 11:27",
        content: "aaatest测试测试测试测试测试测试测试测试测试测试",
        imgSrc: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1487455584208&di=6c4bfa226385cf59fbd0a10944dc7d5c&imgtype=0&src=http%3A%2F%2Fimg1.gamersky.com%2Fimage2017%2F02%2F20170218_zl_91_8%2Fgamersky_03small_06_2017218205860A.jpg"
      },
      {
        id: 2,
        avatarUrl: "http://7xsmkb.com1.z0.glb.clouddn.com/kakumon3.jpg",
        username: "2test测试测试测试测试",
        date: "2017/02/20 11:27",
        content: "aaatest测试测试测试测试测试测试测试测试测试测试",
        imgSrc: "http://7xsmkb.com1.z0.glb.clouddn.com/kakumon3.jpg"
      },
      {
        id: 3,
        avatarUrl: "http://7xsmkb.com1.z0.glb.clouddn.com/kumamon1.jpeg",
        username: "3test测试测试测试测试",
        date: "2017/02/20 11:27",
        content: "aaatest测试测试测试测试测试测试测试测试测试测试",
        imgSrc: "http://7xsmkb.com1.z0.glb.clouddn.com/kumamon1.jpeg"
      }
    ],
    moreComments: [
      {
        id: 4,
        avatarUrl: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1487455584208&di=6c4bfa226385cf59fbd0a10944dc7d5c&imgtype=0&src=http%3A%2F%2Fimg1.gamersky.com%2Fimage2017%2F02%2F20170218_zl_91_8%2Fgamersky_03small_06_2017218205860A.jpg",
        username: "4test测试测试测试测试test测试测试测试测试test测",
        date: "2017/02/20 11:27",
        content: "aaatest测试测试测试测试测试测试测试测试测试测试aaatest测试测试测试测试测试测试测试测试测试测试",
        imgSrc: "http://7xsmkb.com1.z0.glb.clouddn.com/kakumon2.jpg"
      },
      {
        id: 5,
        avatarUrl: "http://7xsmkb.com1.z0.glb.clouddn.com/kakumon2.jpg",
        username: "5test测试测试测试测试",
        date: "2017/02/20 11:27",
        content: "aaatest测试测试测试测试测试测试测试测试测试测试",
        imgSrc: null
      },
      {
        id: 6,
        avatarUrl: "http://7xsmkb.com1.z0.glb.clouddn.com/kakumon3.jpg",
        username: "6test测试测试测试测试",
        date: "2017/02/20 11:27",
        content: "aaatest测试测试测试测试测试测试测试测试测试测试",
        imgSrc: "http://7xsmkb.com1.z0.glb.clouddn.com/kakumon3.jpg"
      }
    ],
    loadmore: false,
    loadend: false
  },
  onReachBottom: function() {
    //正在加载或已加载完时reachbottom无效
    if(this.data.loadmore === false && this.data.loadend === false) {
      //正在加载
      this.data.loadmore === true
      this.setData({
        loadmore: true
      })

      //模拟5s后收到后台返回的评论信息
      var that = this
      setTimeout(function() {
        //加载结束
        that.setData({
          loadmore: false,
          loadend: true,//模拟已加载完所有数据
          comments: that.data.comments.concat(that.data.moreComments)
        })
        that.data.loadmore === false
      }, 5000)
    }
  }
})
