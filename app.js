var qcloud = require('./bower_components/qcloud-weapp-client-sdk/index.js')
var config = require('./config.js')

App({
  onLaunch: function() {
    /**
    * 小程序初始化时执行，初始化客户端的登录地址，以支持所有的会话操作
    */
    qcloud.setLoginUrl(config.service.loginUrl)
    //登录，建立微信小程序会话
    qcloud.login({
      success: function(userInfo) {
        console.log("login success", userInfo)
      },
      fail: function(err) {
        console.log("login fail", err)
        wx.showModal({
            content: err.message,
            showCancel: false
        })
      }
    })
  },
  globalData: {
    tweetUrl: ''
  }
})
