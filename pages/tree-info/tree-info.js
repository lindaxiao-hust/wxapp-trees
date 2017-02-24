var util = require('../../utils/util.js')
var treeInfoTitles = {
  plantId: "植物id",
  species: "物种",
  chName: "中文名",
  otherName: "别名",
  enName: "英文名",
  latName: "拉丁学名",
  phylum: "门名称",
  biologyClass: "纲名称",
  superOrder: "超目名称",
  biologyOrder: "目名称",
  family: "科名称",
  familyLat: "科的拉丁名",
  genus: "属",
  genusLat: "属的拉丁名",
  variety: "变种",
  cultivar: "品种",
  growthHabit: "生长习性(1、乔木2、灌木3、一年生草本4、二年生草本5、多年生草本6、藤本)",
  growthHabit2: "生长习性2（1、常绿2、落叶3、半常绿）",
  ecolHabit: "生态习性3（1、陆生2、湿生3、水生4、寄生）",
  florescence: "花期",
  fruitPeriod: "果期",
  feature: "形态学特征",
  habitat: "生活环境",
  distribution: "分布",
  ecoValue: "应用价值",
  cultures: "植物文化",
  plantLink: "植物专业分类详细信息链接",
  qrCode: "植物基本信息二维码的路径",
  createTime: "创建时间",
  pictures: "该plant对应的图片信息",
  pictureLinks: "该plant对应的图片超链接（用于小程序端）"
}

Page({
  data: {
    treeInfoTitleArray: [],//存放植物名列表
    treeInfoArray: [],//存放植物信息列表
    treeCultureArray: []//存放植物文化列表
  },
  onLoad: function(option) {
    var treeInfo = JSON.parse(option.treeInfo)
    var key = null
    var treeInfoArrayTmp = []
    var treeInfoTitleArrayTmp = []
    for(key in treeInfoTitles) {
      if(key !== 'plantId' && key !== 'pictures' && key !== 'pictureLinks' && key !== 'cultures' && key !== 'qrCode' && key !== 'species') {
        treeInfoTitleArrayTmp.push(treeInfoTitles[key])
        if(treeInfo[key] === "") {
          treeInfo[key] = "暂无相关信息"
        }
        if(key === 'createTime') {
          treeInfo[key] = util.formatDateTime(treeInfo[key])
        }
        treeInfoArrayTmp.push(treeInfo[key])
      }
    }
    console.log(treeInfoArrayTmp);
    console.log(treeInfoTitleArrayTmp);
    this.setData({
      species: treeInfo['species'],
      treeInfoTitleArray: treeInfoTitleArrayTmp,
      treeInfoArray: treeInfoArrayTmp,
      treeCultureArray: treeInfo.cultures
    })
    console.log(this.data.treeCultureArray);
  }
})
