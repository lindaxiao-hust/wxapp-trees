Page({
  data: {
    treeInfo: {
      species: "species",
      chName: "chName",
      otherName: "otherName",
      enName: "enName",
      latName: "latName",
      phylum: "phylum",
      biologyClass: "biologyClass",
      superOrder: "superOrder",
      biologyOrder: "biologyOrder",
      family: "family",
      familyLat: "familyLat",
      genus: "genus",
      genusLat: "genusLat",
      variety: "variety",
      cultivar: "cultivar",
      growthHabit: "growthHabit",
      growthHabit2: "growthHabit2",
      ecolHabit: "ecolHabit",
      florescence: "florescence",
      fruitPeriod: "fruitPeriod",
      feature: "feature",
      habitat: "habitat",
      distribution: "distribution",
      ecoValue: "ecoValue",
      cultures: ["cultures"],
      plantLink: "plantLink",
      qrCode: "qrCode",
      createTime: "createTime",
      pictures: ["pictures"],
      pictureLinks: ["pictureLinks"]
    },
    treeInfoTitlesKey: [],
    treeInfoTitles: ["物种", "中文名字", "别名", "英文名", "拉丁学名", "门名称", "纲", "超目", "目", "科", "科的拉丁名", "属", "属的拉丁名", "变种", "品种", "生长习性(1、乔木2、灌木3、一年生草本4、二年生草本5、多年生草本6、藤本)", "生长习性2（1、常绿2、落叶3、半常绿）", "生态习性3（1、陆生2、湿生3、水生4、寄生）", "花期", "果期", "生态学特征", "生活环境", "分布", "应用价值", "植物文化", "植物专业分类详细信息链接", "植物基本信息二维码的路径", "创建时间", "该plant对应的图片信息", "该plant对应的图片超链接（用于小程序端）"]
  },
  onLoad: function() {
    this.setData({
      treeInfoTitlesKey: Object.keys(this.data.treeInfo)
    })
  }
})
