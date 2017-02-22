var qcloud = require('./bower_components/qcloud-weapp-client-sdk/index.js')
var config = require('./config.js')

App({
  onLaunch: function() {
    /**
    * 小程序初始化时执行，初始化客户端的登录地址，以支持所有的会话操作
    */
    qcloud.setLoginUrl(config.service.loginUrl)
  }
})
