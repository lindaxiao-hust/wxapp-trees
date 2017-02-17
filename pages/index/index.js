Page({
  onLoad: function() {
    console.log('Page Load')
  },
  onReady: function() {
    console.log('Page Ready')
  },
  onShow: function() {
    console.log('Page Show')
  },
  onHide: function() {
    console.log('Page Hide')
  },
  onUnload: function() {
    console.log('Page Unload')
  },
  open: function() {
    wx.showActionSheet({
      itemList: ['a', 'b', 'c'],
      success: function(res) {
        if(!res.cancel) {
          console.log(res.tapIndex)
        }
      },
      fail: function(res) {
        console.log(res.errMsg)
      }
    })
  }
})
