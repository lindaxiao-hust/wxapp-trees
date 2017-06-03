var qcloud = require("../../bower_components/qcloud-weapp-client-sdk/index.js")
var util = require('../../utils/util.js')
var config = require('../../config')
var treeInfoTitles = {
  plantId: "植物id",
  species: "物种",
  otherName: "别名",
  enName: "英文名",
  latName: "拉丁学名",
  intro: "简介",
  family: "科",
  genus: "属",
  // phylum: "门名称",
  // biologyClass: "纲",
  // biologyOrder: "目",
  scientificInfo: "科学中的它",
  humanisticInfo: "人文中的它",
  // gps: "GPS信息",
  remark: "备注",
  qrCode: "项目下植物的二维码",
  createTime: "创建时间",
  pictures: "该plant对应的图片信息",
  pictureLinks: "该plant对应的图片超链接（用于小程序端）"
}

Page({
  data: {
    httpsHost: config.service.httpsHost,
    defaultImg: config.defaultImg,
    defaultAudioPoster: config.defaultAudioPoster,
    treeInfoTitleArray: [],//存放植物名列表
    treeInfoArray: [],//存放植物信息列表
    // treeCultureArray: [],//存放植物文化列表
    dataLoadStatus: 'loading', //判断页面数据是否加载状态
    audioAction: {
      method: 'pause'
    }
  },
  globalData: {
    plantImgUrls: []//当前植物的图片地址列表
  },
  onLoad: function(option) {
    console.log(option);
    var plantId = option.plantId
    var treeInfo = {}
    var that = this
    qcloud.request({
      login: true,
      url: config.service.plantRequestUrl + 'detail/pid=' + plantId,
      success: function(response) {
        console.log(response);
        if(response.statusCode === 200) {
          treeInfo = response.data.plantInfo
          //导出图片链接数组
          for(let index in treeInfo.pictures) {
            that.globalData.plantImgUrls.push(config.service.httpsHost + treeInfo.pictures[index].pictureName)
          }
          var treeInfoArrayTmp = []
          var treeInfoTitleArrayTmp = []
          for(let key in treeInfoTitles) {
            if(key !== 'plantId' && key !== 'pictures' && key !== 'pictureLinks' && key !== 'cultures' && key !== 'qrCode' && key !== 'species') {
              if(!treeInfo[key] || treeInfo[key] === "") {
                // treeInfo[key] = "暂无相关信息"
                continue
              }
              treeInfoTitleArrayTmp.push(treeInfoTitles[key])
              if(key === 'createTime') {
                treeInfo[key] = util.formatDateTime(treeInfo[key])
              }
              treeInfoArrayTmp.push(treeInfo[key])
            }
          }

          that.setData({
            audio: treeInfo['audio'],
            audioPoster: treeInfo['audioPoster'],
            audioName: treeInfo['audioName'],
            audioAuthor: treeInfo['audioAuthor'],
            species: treeInfo['species'],
            treeInfoTitleArray: treeInfoTitleArrayTmp,
            treeInfoArray: treeInfoArrayTmp,
            // treeCultureArray: treeInfo.cultures,
            dataLoadStatus: 'success',
            plantImgsLen: that.globalData.plantImgUrls.length,
            plantImg: that.globalData.plantImgUrls[0]
          })
        }
      }
    })
  },
  showPlantImgs: function() {
    wx.previewImage({
      urls: this.globalData.plantImgUrls,
      fail: function() {
        wx.showToast({
          title: '加载图片失败',
          icon: 'warn'
        })
      }
    })
  }
})
